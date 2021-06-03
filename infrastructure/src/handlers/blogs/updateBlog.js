const slugify = require('slugify');
const sanitizeHtml = require('sanitize-html')
const postgres = require('../../utils/postgres.js')
const api = require('../../utils/api.js')
const auth = require('../../utils/authenticate')
const { logger } = require('../../utils/logging')

module.exports = (app) => {
  app.options('/v1/blog/:blog_id', auth.cors)

  app.patch('/v1/blog/:blog_id', auth.required, auth.cors, async (req, res) => {
    logger.verbose('update blog handler starts')
    const { blog_id } = req.params
    if (!blog_id) {
      return api.sendMissingParam(res, 'blogId')
    }
    const {
      source
    } = req.body
    
    if (!source) {
      return api.sendMissingParam(res, 'source')
    }
    // if (!picture) {
    //   return api.sendMissingParam(res, 'picture')
    // }
    let dbClient
    try {

      dbClient = await postgres.connectToDatabase()
      logger.debug('Postgres connected')

      const blog = await updateBlog(dbClient, req.body)
      logger.debug('Blog updated')
      
      logger.debug('Updated blog fetched')
      return api.sendResponse(res, api.createResponse(blog))

    } catch (err) {

      logger.error('Request failed', err)
      return api.sendInternalError(res, api.createError('Failed to create poll', 'sign-in.something-went-wrong'))

    } finally {

      dbClient.end()
    }
  })
}

async function updateBlog (dbClient, body) {
  let allowDup = false, text = '', values = []
  const dupBlogId = postgres.generateTimeId()
  // const content = sanitizeHtml(source, api.sanitizeConfigure())
  const slug = (await postgres.isDupSlug(dbClient, body.slug, body.blog_id)) ? body.slug +'-'+ dupBlogId : body.slug
  
  // get tag & category id

  const primaryTagId = await getTagId(dbClient, body.primary_tag[0])
  const secondaryTagId = await getTagId(dbClient, body.secondary_tag[0])
  const primaryCategoryId = await getCategoryId(dbClient, body.primary_category[0])
  const secondaryCategoryId = await getCategoryId(dbClient, body.secondary_category[0])

  // get author & blog id

  const authorId = await getAuthorId(dbClient, body.author[0])

  if(body.dup){
    allowDup = await getAllowDup(dbClient, body.blog_id)

    if(allowDup) {
      const lang = (body.lang === 'en') ? 'es' : 'en'
      text = `INSERT INTO blogs(blog_id, user_id, caption, published, created_on, updated_on, content,
              primary_tag, secondary_tag, slug, primary_category, secondary_category, description, url, snippet, author_id,
              note, "like", comment, linked_id, lang)
              VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21) RETURNING * `
      values = [dupBlogId, body.user_id, api.capitalize(body.title), body.published, new Date(), new Date(), body.source, primaryTagId,
              secondaryTagId, slug, primaryCategoryId, secondaryCategoryId, body.description, `${process.env.WEB_URL}/${slug}`,
              body.snippet, authorId, body.note, body.like, body.comment, body.blog_id, lang]
    }
  }else{
    text = `UPDATE blogs SET caption=$1, content=$2, updated_on=$3, slug=$4, description=$5, snippet=$6, note=$7,
            primary_tag=$8, secondary_tag=$9, primary_category=$10, secondary_category=$11,
            author_id=$12, published=$13, url=$14
            WHERE blog_id=$15 RETURNING *`
    values = [
      api.capitalize(body.title),
      body.source,
      new Date(body.updated_on),
      slug,
      body.description,
      body.snippet,
      body.note,
      primaryTagId,
      secondaryTagId,
      primaryCategoryId,
      secondaryCategoryId,
      authorId,
      body.published,
      `${process.env.WEB_URL}/${slug}`,
      body.blog_id
    ]

  }

  try {
    const res = await dbClient.query(text, values)
    const updatedBlog = res.rows[0]

    let id = '';
    if(body.dup && allowDup){
      id = dupBlogId
      await dbClient.query('UPDATE blogs SET linked_id=$1 WHERE blog_id=$2', [dupBlogId, body.blog_id])
    }else{
      id = body.blog_id
    }

    await updateTags(dbClient, id, body.tags)
    await updateReferring(dbClient, id, body.referringPage)
    await updateRelated(dbClient, id, body.relatedPage)
    

    return updatedBlog

  } catch (err) {

    logger.debug(err.stack)
    return err.stack

  }
}

async function updateTags(dbClient, id, tags) {

  // remove old tag list

  const deleteTagText = 'DELETE FROM blogtags  WHERE blog_id = $1;'
  const deleteTagValue = [id]

  // insert new tag list

  let insertTagText = 'SELECT tag_id FROM tags WHERE '
  tags.forEach((item, i) => {
    const ins = 'tag_name=$' + (i + 1) + ' OR '
    insertTagText += ins
  })
  insertTagText = insertTagText.slice(0, insertTagText.length - 3)

  try {

    await dbClient.query(deleteTagText, deleteTagValue)

    if(tags.length > 0) {
      const tagIndexArrayRes = await dbClient.query(insertTagText, tags);
      const tagIndexArray = tagIndexArrayRes.rows
      const insertBlogTagsText = 'INSERT INTO blogtags(tag_id, blog_id) VALUES ($1, $2)'


      for (let i = 0; i < tagIndexArray.length; i++){
        await dbClient.query(insertBlogTagsText, [tagIndexArray[i].tag_id, id])
      }
    }


  }catch(err) {

  }
}

async function updateReferring(dbClient, id, referring) {
  // remove old referring list
  const deleteReferringText = 'DELETE FROM referring WHERE blog_id = $1;'
  const deleteReferringValue = [id]

  // insert new referring list
  const blogIdArray = []
  for(let i = 0; i < referring.length; i++) {
    blogIdArray.push(await getBlogId(dbClient, referring[i]))
  }

  try {

    await dbClient.query(deleteReferringText, deleteReferringValue)

    if(referring.length > 0) {
      
      const insertReferringText = 'INSERT INTO referring(blog_id, referring_id) VALUES ($1, $2) RETURNING *'

      for (let i = 0; i < blogIdArray.length; i++){
        const re = await dbClient.query(insertReferringText, [id, blogIdArray[i]])
      }
    }


  }catch(err) {
    logger.debug(err)
  }
}


async function updateRelated(dbClient, id, related) {

  // remove old related list
  const deleteRelatedText = 'DELETE FROM related WHERE blog_id = $1;'
  const deleteRelatedValue = [id]

  // insert new related list
  const blogIdArray = []
  for(let i = 0; i < related.length; i++) {
    blogIdArray.push(await getBlogId(dbClient, related[i]))
  }

  try {

    await dbClient.query(deleteRelatedText, deleteRelatedValue)

    if(related.length > 0) {
      
      const insertRelatedText = 'INSERT INTO related(blog_id, related_id) VALUES ($1, $2)'

      for (let i = 0; i < blogIdArray.length; i++){
        await dbClient.query(insertRelatedText, [id, blogIdArray[i]])
      }
    }


  }catch(err) {

    logger.debug(err)
  }
}

async function getAllowDup(dbClient, id){
  const text = 'SELECT linked_id FROM blogs WHERE blog_id=$1'
  const values = [id]

  try{
    const res = await dbClient.query(text, values)
    if(!!res.rows[0].linked_id) return false
    return true
  }catch(err){
    logger.debug(err.stack)
    return err.stack
  }
}

async function getTagId(dbClient, tagName) {
  
  const text = 'SELECT tag_id FROM tags WHERE tag_name=$1'
  const value = [tagName]

  try {
    const res = await dbClient.query(text, value)
    return (res.rows.length > 0) ? res.rows[0].tag_id: null
  }catch(err) {
    logger.debug(err)
    return err.stack
  }
}

async function getCategoryId(dbClient, categoryName) {
  
  const text = 'SELECT category_id FROM category WHERE category_name=$1'
  const value = [categoryName]

  try {
    const res = await dbClient.query(text, value)
    return (res.rows.length > 0) ? res.rows[0].category_id: null
  }catch(err) {
    logger.debug(err)
    return err.stack
  }
}

async function getAuthorId(dbClient, authorName) {
  
  const text = 'SELECT user_id FROM users WHERE username=$1'
  const value = []
  value.push(authorName)

  try {
    const res = await dbClient.query(text, value)
    return  (res.rows.length > 0) ? res.rows[0].user_id: null
  }catch(err) {
    logger.debug(err)
    return err.stack
  }
}

async function getBlogId(dbClient, slug) {
  
  const text = 'SELECT blog_id FROM blogs WHERE slug=$1'
  const value = [slug]

  try {
    const res = await dbClient.query(text, value)
    return  (res.rows.length > 0) ? res.rows[0].blog_id: null
  }catch(err) {
    logger.debug(err)
    return err.stack
  }
}
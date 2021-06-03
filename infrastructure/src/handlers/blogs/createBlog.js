const slugify = require('slugify')
const dayjs = require('dayjs')
const customParseFormat = require('dayjs/plugin/customParseFormat')
const sanitizeHtml = require('sanitize-html')

dayjs.extend(customParseFormat)

const postgres = require('../../utils/postgres.js')
const api = require('../../utils/api.js')
const auth = require('../../utils/authenticate')
const { logger } = require('../../utils/logging')

module.exports = (app) => {
  app.options('/v1/blog', auth.cors)
  app.options('/v1/delete-blog/:slug/lang', auth.cors)

  app.post('/v1/blog', auth.required, auth.cors, async (req, res) => {
    logger.verbose('create blog handler starts')

    const {
      title, source, tags, lang
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

      let user = auth.getIdentity(req.identity)
      if (user === null) {
        return api.sendBadRequest(res, api.createError(`User ${user} not found`, 'generic.internal-error'))
      }
      const blogId = postgres.generateTimeId()
      const blog = await insertBlog(dbClient, blogId, title, source, user, tags, lang)
      console.log(blog)
      logger.debug('Blog inserted')

      const tagList = await postgres.getTagList(dbClient, blogId)
      blog.tags = tagList;
      return api.sendCreated(res, api.createResponse(blog))
    } catch (err) {
      logger.error('Request failed', err)
      return api.sendInternalError(res, api.createError('Failed to create post', 'sign-in.something-went-wrong'))
    } finally {
      dbClient.end()
    }
  })

  app.delete('/v1/delete-blog/:slug/:lang', auth.required, auth.admin, auth.cors, async (req, res) => {
    logger.verbose('Delete blog handler starts')
    const { slug, lang } = req.params;

    let dbClient

    try {
      dbClient = await postgres.connectToDatabase()
      logger.debug('Postgres connected')

      let user = auth.getIdentity(req.identity)
      if (user === null) {
        return api.sendBadRequest(res, api.createError(`User ${user} not found`, 'generic.internal-error'))
      }
      
      const blog = await deleteBlog(dbClient, slug, lang)
      
      if(blog.slug === slug){
        logger.debug('Blog deleted')
        await deleteTags(dbClient, blog.blog_id)
      }else {
        logger.debug('Got error')
      }
      
      return api.sendCreated(res, api.createResponse(blog))
    } catch (err) {
      logger.error('Request failed', err)
      return api.sendInternalError(res, api.createError('Failed to create post', 'sign-in.something-went-wrong'))
    } finally {
      dbClient.end()
    }
  })

}

async function insertBlog (dbClient, blogId, title, source, user, tags, lang) {
  // const content = sanitizeHtml(source, api.sanitizeConfigure())
  const s = slugify(title, { lower: true, strict: true })
  const slug = (await postgres.isDupSlug(dbClient, s, '')) ? s +'-'+ blogId : s
  
  const text = `INSERT INTO blogs(blog_id, user_id, caption, published, created_on, updated_on, content, slug, url, lang, author_id) 
  VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *`
  const values = [blogId, user.userId, api.capitalize(title), false, 
    new Date(), new Date(), source, slug, `${process.env.WEB_URL}/${slug}`, lang, user.userId]

  try {
    const res = await dbClient.query(text, values)
    const insertedBlog = res.rows[0]

    await insertTags(dbClient, insertedBlog.blog_id, tags)

    return insertedBlog

  } catch (err) {

    return err.stack

  }
}

async function insertTags(dbClient, id, tags) {

  if(tags.length === 0) return false;

  let insertTagText = 'SELECT tag_id FROM tags WHERE '
  tags.forEach((item, i) => {
    const ins = 'tag_name=$' + (i + 1) + ' OR '
    insertTagText += ins
  })
  insertTagText = insertTagText.slice(0, insertTagText.length - 3)

  try {
    const tagIndexArrayRes = await dbClient.query(insertTagText, tags);
    const tagIndexArray = tagIndexArrayRes.rows
    const insertBlogTagsText = 'INSERT INTO blogtags(tag_id, blog_id) VALUES ($1, $2) RETURNING *'

    for (let i=0; i< tagIndexArray.length; i++){
      await dbClient.query(insertBlogTagsText, [tagIndexArray[i].tag_id, id])
    }

  } catch (err) {

    return err.stack

  }
}

async function deleteBlog(dbClient, slug, lang) {
  const text = 'DELETE FROM blogs WHERE slug=$1 AND lang=$2 RETURNING *';
  const values = [slug, lang];
  
  try {
    const res = await dbClient.query(text, values)
    const deletedBlog = res.rows[0]

    return deletedBlog

  } catch (err) {

    return err.stack

  }
}

async function deleteTags(dbClient, blogId) {
  const text = 'DELETE FROM blogtags WHERE blog_id=$1';
  const values = [blogId];

  try {
    const res = await dbClient.query(text, values)

    return true

  } catch (err) {

    return err.stack

  }
}
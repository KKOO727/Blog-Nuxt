const postgres = require('../../utils/postgres.js')
const api = require('../../utils/api.js')
const auth = require('../../utils/authenticate')
const { logger } = require('../../utils/logging')

require('../../utils/path_env')

module.exports = (app) => {
  app.options('/v1/blogs/:lang', auth.cors)
  app.options('/v1/blogs-all/:lang', auth.cors)
  app.options('/v1/blogs/unpublished/:lang', auth.cors)
  app.options('/v1/category-blogs/:slug/:lang', auth.cors)
  app.options('/v1/tag-blogs/:slug/:lang', auth.cors)
  app.options('/v1/search-blogs/:slug/:lang', auth.cors)
  app.options('/v1/admin-blogs/', auth.cors)

  app.get('/v1/admin-blogs', auth.required, auth.admin, auth.cors, async (req, res) => {
    logger.debug('Get Admin blogs')

    let dbClient;

    try {
      dbClient = await postgres.connectToDatabase()
      logger.debug('Postgres connected')

      const blogs = await getAdminBlogList(dbClient)
      logger.debug('Blogs fetched')

      return api.sendCreated(res, api.createResponse(blogs))
      
    } catch (err) {

      logger.error('Request failed', err)
      return api.sendInternalError(res, api.createError('Failed to get items', 'sign-in.something-went-wrong'))

    } finally {
      dbClient.end()
    }
  })

  app.get('/v1/blogs-all/:lang', auth.cors, async (req, res) => {
    logger.debug('Get blogs')
    const { lang } = req.params

    let dbClient;

    try {
      dbClient = await postgres.connectToDatabase()
      logger.debug('Postgres connected')

      const blogs = await getAllBlogs(dbClient, lang)
      logger.debug('Blogs fetched')

      return api.sendCreated(res, api.createResponse(blogs))
      
    } catch (err) {

      logger.error('Request failed', err)
      return api.sendInternalError(res, api.createError('Failed to get items', 'sign-in.something-went-wrong'))

    } finally {
      dbClient.end()
    }
  })

  app.get('/v1/blogs/:lang', auth.cors, async (req, res) => {
    logger.debug('Get blogs')
    const { lang } = req.params

    let dbClient;

    try {
      dbClient = await postgres.connectToDatabase()
      logger.debug('Postgres connected')

      const blogs = await getBlogs(dbClient, true, lang)
      logger.debug('Blogs fetched')

      return api.sendCreated(res, api.createResponse(blogs))
      
    } catch (err) {

      logger.error('Request failed', err)
      return api.sendInternalError(res, api.createError('Failed to get items', 'sign-in.something-went-wrong'))

    } finally {
      dbClient.end()
    }
  })

  app.get('/v1/blogs/unpublished/:lang', auth.required, auth.cors, async (req, res) => {
    logger.debug('Get blogs')
    const { lang } = req.params

    let dbClient;

    try {
      dbClient = await postgres.connectToDatabase()
      logger.debug('Postgres connected')

      const blogs = await getBlogs(dbClient, false, lang)
      logger.debug('Blogs fetched')

      return api.sendCreated(res, api.createResponse(blogs))
      
    } catch (err) {

      logger.error('Request failed', err)
      return api.sendInternalError(res, api.createError('Failed to get items', 'sign-in.something-went-wrong'))

    } finally {
      dbClient.end()
    }
  })

  app.get('/v1/category-blogs/:slug/:lang', auth.cors, async (req, res) => {
    logger.debug('Get category blogs')

    const { slug, lang } = req.params
    let dbClient;

    try {
      dbClient = await postgres.connectToDatabase()
      logger.debug('Postgres connected')

      const blogs = await getCategoryBlogs(dbClient, slug, lang)
      logger.debug('Category Blogs fetched')

      return api.sendCreated(res, api.createResponse(blogs))
      
    } catch (err) {

      logger.error('Request failed', err)
      return api.sendInternalError(res, api.createError('Failed to get items', 'sign-in.something-went-wrong'))

    } finally {
      dbClient.end()
    }
  })

  app.get('/v1/tag-blogs/:slug/:lang', auth.cors, async (req, res) => {
    logger.debug('Get tag blogs')

    const { slug, lang } = req.params
    let dbClient;

    try {
      dbClient = await postgres.connectToDatabase()
      logger.debug('Postgres connected')

      const blogs = await getTagBlogs(dbClient, slug, lang)
      logger.debug('Tag Blogs fetched')

      return api.sendCreated(res, api.createResponse(blogs))
      
    } catch (err) {

      logger.error('Request failed', err)
      return api.sendInternalError(res, api.createError('Failed to get items', 'sign-in.something-went-wrong'))

    } finally {
      dbClient.end()
    }
  })



  app.get('/v1/search-blogs/:slug/:lang', auth.cors, async (req, res) => {
    logger.debug('Get search blogs')

    const { slug } = req.params
    let dbClient;

    try {
      dbClient = await postgres.connectToDatabase()
      logger.debug('Postgres connected')

      const blogs = await getSearchBlogs(dbClient, slug, lang)
      logger.debug('Search Blogs fetched')

      return api.sendCreated(res, api.createResponse(blogs))
      
    } catch (err) {

      logger.error('Request failed', err)
      return api.sendInternalError(res, api.createError('Failed to get items', 'sign-in.something-went-wrong'))

    } finally {
      dbClient.end()
    }
  })

}

async function getAdminBlogList(dbClient){
  const lang = 'en'
  const text = `SELECT blogs.blog_id, users.username, blogs.caption, blogs.published, blogs.updated_on, blogs.slug,
  array_agg(category_name) as category_name,  array_agg(tag_name) as tag_name, T1.slug as linked_slug
  
  FROM blogs LEFT JOIN blogs AS T1 ON blogs.blog_id=T1.linked_id
  LEFT JOIN users ON blogs.author_id=users.user_id
  LEFT JOIN category ON blogs.primary_category=category_id OR blogs.secondary_category=category_id
  LEFT JOIN tags ON blogs.primary_tag=tag_id OR blogs.secondary_tag=tag_id
  
  GROUP BY blogs.blog_id, users.user_id, T1.slug
  HAVING blogs.lang=$1
  ORDER BY updated_on DESC`
  try {
    const res = await dbClient.query(text, [lang])
    return (res.rows.length > 0) ? res.rows : null
  } catch (err) {
    return err.stack
  }
}

async function getAllBlogs(dbClient, lang){
  const text = `SELECT blog_id, user_id, caption, published, created_on, updated_on, slug,
              "like", comment, category_name as category, description, linked_id
              FROM blogs LEFT JOIN category ON blogs.primary_category=category.category_id
              WHERE lang=$1 ORDER BY updated_on DESC, created_on DESC`
  try {
    const res = await dbClient.query(text, [lang])
    return (res.rows.length > 0) ? res.rows : null
  } catch (err) {
    return err.stack
  }
}



async function getBlogs(dbClient, published, lang){
  const text = `SELECT blog_id, user_id, caption, published, created_on, updated_on, slug,
              "like", comment, category_name as category, description, linked_id
              FROM blogs LEFT JOIN category ON blogs.primary_category=category.category_id
              WHERE published=${published} AND lang=$1 ORDER BY updated_on DESC, created_on DESC`
  try {
    const res = await dbClient.query(text, [lang])
    return (res.rows.length > 0) ? res.rows : null
  } catch (err) {
    return err.stack
  }
}

async function getCategoryBlogs(dbClient, category, lang){
  const text = `SELECT blog_id, user_id, caption, published, created_on, updated_on, slug, "like", comment, category.category_name as category, description, linked_id
              FROM blogs INNER JOIN category 
                    ON blogs.primary_category=category.category_id OR blogs.secondary_category=category.category_id
              WHERE category.category_name=$1 AND published=true AND lang=$2
              ORDER BY updated_on DESC, created_on DESC`
  const values = [category, lang]

  try {
    const res = await dbClient.query(text, values)
    return (res.rows.length > 0) ? res.rows : null
  } catch (err) {
    return err.stack
  }
}

async function getTagBlogs(dbClient, tag, lang){
  const text = `(SELECT blogs.blog_id, user_id, caption, published, created_on, updated_on, slug, "like", comment, tags.tag_name as tag, linked_id
                FROM blogs INNER JOIN tags 
                ON blogs.primary_tag=tags.tag_id OR blogs.secondary_tag=tags.tag_id
                WHERE tags.tag_name=$1 AND published=true AND lang=$2
                ORDER BY updated_on DESC, created_on DESC)
                UNION
                (SELECT blogs.blog_id, user_id, caption, published, created_on, updated_on, slug, "like", comment, tags.tag_name as tag, linked_id
                FROM blogs INNER JOIN blogtags ON blogs.blog_id=blogtags.blog_id
                INNER JOIN tags ON blogtags.tag_id=tags.tag_id
                WHERE tags.tag_name=$1 AND published=true AND lang=$2
                ORDER BY updated_on DESC, created_on DESC)`
  const values = [tag, lang]

  try {
    const res = await dbClient.query(text, values)
    return (res.rows.length > 0) ? res.rows : null
  } catch (err) {
    return err.stack
  }
}

async function getSearchBlogs(dbClient, keyword, lang){
  const text = `SELECT blog_id, user_id, caption, published, created_on, updated_on, slug, "like", comment, category_name as category, description, linked_id
              FROM blogs LEFT JOIN category ON blogs.primary_category=category.category_id
              WHERE published=TRUE AND (caption iLike $1 OR "content" ILIKE $1 OR "snippet" ILIKE $1 OR "note" ILIKE $1 ) AND lang=$2
              ORDER BY updated_on DESC, created_on DESC`
  const values = [`%${keyword}%`, lang]
  try {
    const res = await dbClient.query(text, values)
    return (res.rows.length > 0) ? res.rows: null
  } catch (err) {
    return err.stack
  }
}

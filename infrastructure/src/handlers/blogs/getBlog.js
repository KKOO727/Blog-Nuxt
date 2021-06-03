const postgres = require('../../utils/postgres.js')
const api = require('../../utils/api.js')
const auth = require('../../utils/authenticate')
const { logger } = require('../../utils/logging')

require('../../utils/path_env')

module.exports = (app) => {
  app.options('/v1/blog', auth.cors)
  app.options('/v1/blog/slag', auth.cors)

  // auth.required,
  // app.get('/v1/blog/:id', auth.cors, async (req, res) => {
  //   logger.debug('get blog')
  //   const { id } = req.params
  //   let dbClient;
  //   try {
  //     dbClient = await postgres.connectToDatabase()
  //     logger.debug('Postgres connected')

  //     const blog = await postgres.getBlog(dbClient, id)
  //     logger.debug('Blog fetched')

  //     const tagList = await postgres.getTagList(dbClient, id)
  //     blog.tags = tagList;
  //     return api.sendCreated(res, api.createResponse(blog))
  //   } catch (err) {
  //     logger.error('Request failed', err)
  //     return api.sendInternalError(res, api.createError('Failed to get blog', 'sign-in.something-went-wrong'))
  //   } finally {
  //     dbClient.end()
  //   }
  // })

  // auth.required,
  app.get('/v1/blog/slug/:slug/', auth.cors, async (req, res) => {
    logger.debug('get blog')
    const { slug } = req.params
    let dbClient;
    try {
      dbClient = await postgres.connectToDatabase()
      logger.debug('Postgres connected')

      const blog = await postgres.getBlogBySlug(dbClient, slug)
      logger.debug('Slug blog fetched')

      if(!blog) {
        return api.sendCreated(res, api.createResponse(null))
      }
      
      const tagList = await postgres.getTagList(dbClient, blog.blog_id)
      blog.tags = tagList

      const primaryTag = await postgres.getTagById(dbClient, blog.primary_tag)
      blog.primary_tag = primaryTag

      const secondaryTag = await postgres.getTagById(dbClient, blog.secondary_tag)
      blog.secondary_tag = secondaryTag

      const primaryCategory = await postgres.getCategoryById(dbClient, blog.primary_category)
      blog.primary_category = primaryCategory

      const secondaryCategory = await postgres.getCategoryById(dbClient, blog.secondary_category)
      blog.secondary_category = secondaryCategory

      const referringPage = await postgres.getBlogSlugList(dbClient, blog.blog_id, 'referring')
      blog.referringPage = referringPage
      const relatedPage = await postgres.getBlogSlugList(dbClient, blog.blog_id, 'related')
      blog.relatedPage = relatedPage

      const author = await postgres.findUser(dbClient, { user_id: blog.author_id })
      blog.author = [author.username]

      return api.sendCreated(res, api.createResponse(blog))
    } catch (err) {
      logger.error('Request failed', err)
      return api.sendInternalError(res, api.createError('Failed to get blog', 'sign-in.something-went-wrong'))
    } finally {
      dbClient.end()
    }
  })

}

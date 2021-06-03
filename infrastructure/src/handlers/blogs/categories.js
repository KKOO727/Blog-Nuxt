const api = require('../../utils/api.js')
const { logger } = require('../../utils/logging')
const auth = require('../../utils/authenticate')
const postgres = require('../../utils/postgres.js')

require('../../utils/path_env')

module.exports = (app) => {
  app.options('/v1/misc/categories', auth.cors)
  app.options('/v1/misc/new-category', auth.cors)

  app.get('/v1/misc/categories', auth.cors, async (req, res) => {
    logger.debug('get categories')
    let dbClient
    try {

      dbClient = await postgres.connectToDatabase()
      logger.debug('Postgres connected')

      const categories = await postgres.getCategories(dbClient)
      logger.debug('Categories fetched')
      const returnCategories = [];
      categories.map((item) => returnCategories.push(item.category_name))
      return api.sendResponse(res, api.createResponse(returnCategories))

    } catch (err) {

      logger.error('Request failed', err)
      return api.sendInternalError(res, api.createError('Failed to create post', 'sign-in.something-went-wrong'))

    } finally {

      dbClient.end()

    }
  })

  app.post('/v1/misc/new-category', auth.required, auth.admin, auth.cors, async (req, res) => {
    logger.debug('Create category')

    let dbClient

    const {
      categoryName
    } = req.body

    try {
      dbClient = await postgres.connectToDatabase()
      logger.debug('Postgres connected')

      const newCategory = await postgres.createCategory(dbClient, categoryName);
      if(newCategory.length > 0){
        logger.debug('Category Added')
      }
      const categories = await postgres.getCategories(dbClient)
      const returnCategories=[];
      categories.map((item) => returnCategories.push(item.category_name))
      return api.sendResponse(res, api.createResponse(returnCategories))
    } catch (err) {
      logger.error('Request failed', err)
      return api.sendInternalError(res, api.createError('Failed to create post', 'sign-in.something-went-wrong'))
    } finally {
      dbClient.end()
    }
  })
}

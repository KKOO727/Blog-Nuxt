const api = require('../../utils/api.js')
const { logger } = require('../../utils/logging')
const auth = require('../../utils/authenticate')
const postgres = require('../../utils/postgres.js')

require('../../utils/path_env')

module.exports = (app) => {
  app.options('/v1/misc/tags', auth.cors)
  app.options('/v1/misc/new-tag', auth.cors)

  app.get('/v1/misc/tags', auth.cors, async (req, res) => {
    logger.debug('get tags')
    let dbClient
    try {
      dbClient = await postgres.connectToDatabase()
      logger.debug('Postgres connected')

      const tags = await postgres.getTags(dbClient)
      logger.debug('User fetched')
      const returnTags=[];
      tags.map((item)=> returnTags.push(item.tag_name))
      return api.sendResponse(res, api.createResponse(returnTags))
    } catch (err) {
      logger.error('Request failed', err)
      return api.sendInternalError(res, api.createError('Failed to create post', 'sign-in.something-went-wrong'))
    } finally {
      dbClient.end()
    }
  })

  app.post('/v1/misc/new-tag', auth.required, auth.admin, auth.cors, async (req, res) => {
    logger.debug('Create tag')

    let dbClient

    const {
      tagName
    } = req.body

    try {
      dbClient = await postgres.connectToDatabase()
      logger.debug('Postgres connected')

      const newTag = await postgres.createTag(dbClient, tagName);
      if(newTag.length > 0){
        logger.debug('Tag added')
      }
      const tags = await postgres.getTags(dbClient)
      const returnTags=[];
      tags.map((item)=> returnTags.push(item.tag_name))
      return api.sendResponse(res, api.createResponse(returnTags))
    } catch (err) {
      logger.error('Request failed', err)
      return api.sendInternalError(res, api.createError('Failed to create post', 'sign-in.something-went-wrong'))
    } finally {
      dbClient.end()
    }
  })

}

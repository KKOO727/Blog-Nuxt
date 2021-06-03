const postgres = require('../../utils/postgres.js')
const api = require('../../utils/api.js')
const auth = require('../../utils/authenticate')
const { logger } = require('../../utils/logging')

module.exports = (app) => {
  app.options('/v1/users/author-all', auth.cors)
  app.options('/v1/users/all', auth.cors)
  app.options('/v1/user/:userId', auth.cors)
  app.options('/v1/user-roles', auth.cors)

  app.get('/v1/users/author-all', auth.required, auth.admin, auth.cors, async(req, res) => {
    logger.verbose('Get All Authors handler starts')

    let dbClient;
    try {
      dbClient = await postgres.connectToDatabase()
      logger.debug('Postgres connected')

      const users = await postgres.getAllUserName(dbClient)

      logger.debug('All Author User fetched')
      if (!users) {
        return api.sendErrorForbidden(res, api.createError('All User not found', 'profile.user-not-found'))
      }

      return api.sendResponse(res, api.createResponse(users))

    } catch (err) {

      logger.error('Request failed', err)
      return api.sendInternalError(res, api.createError('Failed to load  the users', 'generic.something-went-wrong'))

    } finally {

      dbClient.end()

    }
  })

  app.get('/v1/users/all', auth.required, auth.admin, auth.cors, async(req, res) => {
    logger.verbose('Get All handler starts')

    let dbClient;
    try {
      dbClient = await postgres.connectToDatabase()
      logger.debug('Postgres connected')

      const users = await postgres.getAllUser(dbClient)

      logger.debug('All User fetched')
      if (!users) {
        return api.sendErrorForbidden(res, api.createError('All User not found', 'profile.user-not-found'))
      }

      return api.sendResponse(res, api.createResponse(users))

    } catch (err) {

      logger.error('Request failed', err)
      return api.sendInternalError(res, api.createError('Failed to load  the users', 'generic.something-went-wrong'))

    } finally {

      dbClient.end()

    }
  })

  app.get('/v1/user/:userId', auth.required, auth.admin, auth.cors, async(req, res) => {
    logger.verbose('Get user handler starts')
    const { userId } = req.params

    let dbClient;
    try {
      dbClient = await postgres.connectToDatabase()
      logger.debug('Postgres connected')

      const user = await postgres.getUserById(dbClient, userId)

      logger.debug('User fetched')
      if (!user) {
        return api.sendErrorForbidden(res, api.createError('User not found', 'profile.user-not-found'))
      }

      return api.sendResponse(res, api.createResponse(user))

    } catch (err) {

      logger.error('Request failed', err)
      return api.sendInternalError(res, api.createError('Failed to load  the users', 'generic.something-went-wrong'))

    } finally {

      dbClient.end()

    }
  })

  app.get('/v1/user-roles', auth.required, auth.admin, auth.cors, async(req, res) => {
    logger.verbose('Get user roles starts')

    let dbClient;
    try {
      dbClient = await postgres.connectToDatabase()
      logger.debug('Postgres connected')

      const roles = await getUserRoles(dbClient)

      logger.debug('User roles fetched')
      if (!roles) {
        return api.sendErrorForbidden(res, api.createError('Roles not found', 'profile.user-not-found'))
      }

      return api.sendResponse(res, api.createResponse(roles))

    } catch (err) {

      logger.error('Request failed', err)
      return api.sendInternalError(res, api.createError('Failed to load  the roles', 'generic.something-went-wrong'))

    } finally {

      dbClient.end()

    }
  })

}

async function getUserRoles(dbClient){
  const text = 'SELECT * FROM roles'
  try {
    const res = await dbClient.query(text)
    return res.rows
  } catch (err) {
    return err.stack
  }
}
const postgres = require('../../utils/postgres.js')
const api = require('../../utils/api.js')
const auth = require('../../utils/authenticate')
const { logger } = require('../../utils/logging')

module.exports = (app) => {
  app.options('/v1/update-user/:userId', auth.cors)

  app.patch('/v1/update-user/:userId', auth.required, auth.admin, auth.cors, async(req, res) => {
    logger.verbose('updateUser handler starts')
    const { userId } = req.params
      // if (req.identity.userId !== userId) {
      //   logger.error(`JWT token = ${req.identity.userId} but URL userId = ${userId}!`)
      //   return api.sendErrorForbidden(res, api.createError('JWT mismatch', 'sign-in.auth-error'))
      // }
    let dbClient
    try {
      dbClient = await postgres.connectToDatabase()
      logger.debug('Postgres connected')

      const user = await updateUser(dbClient, userId, req)
      
      if (user.user_id === Number(userId)) {
        logger.debug('User updated')
        return api.sendResponse(res, api.createResponse(user))
      } else {
        logger.debug('User updated error')
        return api.sendInternalError(res, api.createError('failed update the user', 'sign-up.something-went-wrong'))
      }
    } catch (err) {
      logger.error('Request failed', err)
      return api.sendInternalError(res, api.createError('failed update the user', 'sign-up.something-went-wrong'))
    } finally {
      dbClient.end()
    }
  })
}

async function updateUser(dbClient, userId, req) {
  const { role, verify } = req.body
  
  const text = 'UPDATE users SET role_id=$1, verified=$2 WHERE user_id=$3 RETURNING user_id'
  const values = [role + 1, verify, userId]
  try {
    const res = await dbClient.query(text, values)
    return res.rows[0]
  } catch (err) {
    return err.stack
  }
}
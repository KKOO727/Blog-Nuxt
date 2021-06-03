const bcrypt = require('bcryptjs')
const postgres = require('../../utils/postgres.js')
const api = require('../../utils/api.js')
const auth = require('../../utils/authenticate')
const { logger } = require('../../utils/logging')

const bruteForceDelay = 1000

module.exports = (app) => {
  app.options('/v1/authorizeUser', auth.cors)

  app.post('/v1/authorizeUser', auth.cors, async (req, res) => {
    logger.verbose('authorizeUser handler starts')
    const { email, password } = req.body
    const result = validateParameters(email, password)
    if (!result.success) {
      return api.sendBadRequest(res, result)
    }
    let dbClient

    try {
      dbClient = await postgres.connectToDatabase()
      logger.debug('Postgres connected')

      const user = await postgres.findUser(dbClient, { email })
      logger.debug('User fetched')

      if (!user) {
        logger.debug(`User not found ${email}`)
        setTimeout(() => api.sendErrorForbidden(res, api.createError('Bad credentials', 'sign-in.auth-error')), bruteForceDelay)
        return res
      }

      if (!user.verified) {
        setTimeout(() => api.sendErrorForbidden(res, api.createError('User not verified', 'sign-in.auth-not-verified')), bruteForceDelay)
        return res
      }

      // following part takes more than 1 second with 128 MB RAM on AWS Lambda!
      if (bcrypt.compareSync(password, user.password)) {
        postgres.setLastLogin(dbClient, user)
        logger.debug('Password verified')
        const token = auth.createTokenFromUser(user)
        return api.sendResponse(res, api.createResponse(token))
      }

      logger.verbose(`Password mismatch for user ${user.user_id}`)
      setTimeout(() => api.sendErrorForbidden(res, api.createError('Password mismatch', 'sign-in.password-mismatch')), bruteForceDelay)
      return res
    } catch (err) {
      logger.error('Request failed', err)
      return api.sendInternalError(res, api.createError('Failed to authorize the user', 'sign-in.something-went-wrong'))
    } finally {

      dbClient.end()

    }
  })
}

const validateParameters = (email, password) => {
  const result = { success: true }
  if (!email) {
    result.success = false
    api.addValidationError(result, 1000, 'email', 'Missing email')
  } else if (!email.includes('@') || !email.includes('.')) {
    result.success = false
    api.addValidationError(result, 1001, 'email', 'Invalid email')
  }
  if (!password) {
    result.success = false
    api.addValidationError(result, 1000, 'password', 'Missing password')
  }
  return result
}

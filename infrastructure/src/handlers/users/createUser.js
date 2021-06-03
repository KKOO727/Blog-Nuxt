const bcrypt = require('bcryptjs')
const postgres = require('../../utils/postgres.js')
const api = require('../../utils/api.js')
const auth = require('../../utils/authenticate')
const { logger } = require('../../utils/logging')
const mailService = require('../../utils/mailService')

const { WEB_URL } = process.env

module.exports = (app) => {
  app.options('/v1/users', auth.cors)
  app.options('/v1/delete-user/:userId', auth.cors)

  app.post('/v1/users', auth.cors, async (req, res) => {
    logger.verbose('createUser handler starts')
    const {
      email, password, username
    } = req.body
    const result = validateParameters(email, password, username)
    if (!result.success) {
      logger.debug('validation failed', result)
      return api.sendBadRequest(res, result)
    }

    const verificationToken = postgres.generateId(8)
    const userId = postgres.generateTimeId()
    const dbClient = await postgres.connectToDatabase()
    logger.debug('Mongo connected')

    try {
      await insertUser(dbClient, userId, email, password, username, verificationToken)
      logger.debug('User created')
    } catch (err) {
      logger.error('Request failed', err)
      if (err.code === 11000) {
        if (err.keyValue) {
          if (err.keyValue.email) {
            api.addValidationError(result, 'email', 'email is already registered', 'sign-up.email-exists')
          }
          if (err.keyValue.username) {
            api.addValidationError(result, 'username', 'username has been already taken', 'sign-up.username-exists')
          }
        } else {
          const keyValue = err.errmsg.split('index:')[1].split('dup key')[0].split('_')[0].trim()
          if (keyValue === 'email') {
            api.addValidationError(result, 'email', 'email is already registered', 'sign-up.email-exists')
          }
          if (keyValue === 'username') {
            api.addValidationError(result, 'username', 'username has been already taken', 'sign-up.username-exists')
          }
        }
        return api.sendConflict(res, result)
      }
      return api.sendInternalError(res, api.createError('failed to create new user', 'sign-up.something-went-wrong'))
    } finally {
      dbClient.end()
    }

    try {
      await sendVerificationEmail(email, verificationToken)
      logger.debug('Email sent')
    } catch (err) {
      console.error('Sending email failed', err)
      return api.sendInternalError(res, api.createError('Failed to send email', 'sign-up.something-went-wrong'))
    }

    const token = auth.createToken(userId, username, new Date(), null, false, '1m')
    return api.sendCreated(res, api.createResponse(token))
  })

  app.delete('/v1/delete-user/:userId', auth.required, auth.admin, auth.cors, async (req, res) => {
    logger.verbose('Delete user handler starts')
    const { userId } = req.params;

    let dbClient

    try {
      dbClient = await postgres.connectToDatabase()
      logger.debug('Postgres connected')

      const adminUser = auth.getIdentity(req.identity)
      if (adminUser === null) {
        return api.sendBadRequest(res, api.createError(`User ${adminUser} not found`, 'generic.internal-error'))
      }
      
      const user = await deleteUser(dbClient, userId)
      
      if(user.user_id === Number(userId)){
        logger.debug('User deleted')
        const users = await postgres.getAllUser(dbClient)
        return api.sendResponse(res, api.createResponse(users))
      }else {
        logger.debug('Got error')
        return api.sendInternalError(res, api.createError('failed delete the user', 'sign-up.something-went-wrong'))
      }
      
      return api.sendCreated(res, api.createResponse(user))
    } catch (err) {
      logger.error('Request failed', err)
      return api.sendInternalError(res, api.createError('Failed to delete user', 'sign-in.something-went-wrong'))
    } finally {
      dbClient.end()
    }
  })


}

async function insertUser (dbClient, id, email, password, username, verificationToken) {
  const salt = bcrypt.genSaltSync(10)
  const passwordHash = bcrypt.hashSync(password, salt)
  const now = new Date()

  const text = 'INSERT INTO users(username, email, password, created_on, email_verification, verify_token, role_id, verified) VALUES($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *'
  const values = [username, email, passwordHash, now, false, verificationToken, 8, false]

  try {
    const res = await dbClient.query(text, values)
    return res.rows[0]
  } catch (err) {
    return err.stack
  }
}

const sendVerificationEmail = (email, token) => {
  // const options = {
  //   to: email
  // }
  // const context = {
  //   verificationLink: `${WEB_URL}/verify-token/${token}`
  // }
  // return mailService.sendEmail('confirm_email.json', options, context)
}

const validateParameters = (email, password, username) => {
  const result = { success: true }

  if (!email || !email.includes('@') || !email.includes('.')) {
    result.success = false
    api.addValidationError(result, 'email', 'Missing or invalid email', 'sign-up.email-required')
  }
  if (!password || password.length < 6) {
    result.success = false
    api.addValidationError(result, 'password', 'Missing or short password', 'sign-up.password-required')
  }
  if (!username || username.length < 3) {
    result.success = false
    api.addValidationError(result, 'username', 'Missing or short username', 'sign-up.username-required')
  }
  return result
}

async function deleteUser(dbClient, userId) {
  const text = 'DELETE FROM users WHERE user_id=$1 RETURNING *';
  const values = [userId];
  
  try {
    const res = await dbClient.query(text, values)
    const deletedUser = res.rows[0]

    return deletedUser

  } catch (err) {

    return err.stack

  }
  
}
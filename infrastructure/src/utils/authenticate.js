const jwt = require('jsonwebtoken')
const corsMiddleware = require('cors')

const { logger } = require('../utils/logging')

const api = require('./api')
require('./path_env')

// let CORS_ORIGINS = ['http://localhost:8000', 'http://localhost:3000']
let CORS_ORIGINS = [process.env.WEB_URL, process.env.CLIENT_URL]
try {
  const envOrigins = process.env.CORS_ORIGINS
  if (envOrigins) {
    CORS_ORIGINS = JSON.parse(envOrigins)
  }
} catch (e) {
  logger.error(`Failed to parse CORS_ORIGINS ${e}`)
}

function authenticate (required) {
  return function (req, res, next) {
    const { authorization } = req.headers
    if (authorization) {
      try {
        const token = authorization.split(' ')[1]
        req.identity = jwt.verify(token, process.env.JWT_SECRET)
      } catch (err) {
        api.sendInternalError(res, api.createError('JWT parsing error'))
        res.end()
        return
      }
    }
    if (required && !req.identity) {
      api.sendNotAuthorized(res, api.createError('Authentication required'))
      res.end()
      return
    }
    next()
  }
}

function withRole (role) {
  return function (req, res, next) {
    if (!req.identity.roles || !req.identity.roles.includes(role)) {
      api.sendErrorForbidden(res, api.createError('Access denied'))
      res.end()
      return
    }
    next()
  }
}

function createTokenFromUser (user, expiration = '31d') {
  return createToken(user.user_id, user.username, user.password, user.verified, user.role_name, expiration)
}

function createToken (userId, username, password, verified, roles, expiration = '31d') {
  const jwtData = {
    userId,
    username,
    password,
    verified,
    roles
  }
  
  return jwt.sign(jwtData, process.env.JWT_SECRET, { expiresIn: expiration })
}

function getIdentity (identity) {
  return { userId: identity.userId, username: identity.username }
}

function checkRole (req, role) {
  const user = req.identity
  return user && user.roles && user.roles.includes(role)
}

const corsPerRoute = corsMiddleware({
  origin: CORS_ORIGINS,
  allowedHeaders: ['Content-Type', 'Authorization'],
  // preflightContinue: false,
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
})

const ROLE_ADMIN = 'admin'
// const ROLE_CMS_ADMIN = 'admin:cms'

module.exports.optional = authenticate(false)
module.exports.required = authenticate(true)
module.exports.admin = withRole(ROLE_ADMIN)
module.exports.ROLE_ADMIN = ROLE_ADMIN
// module.exports.cms_admin = withRole(ROLE_CMS_ADMIN)
// module.exports.ROLE_CMS_ADMIN = ROLE_CMS_ADMIN
module.exports.cors = corsPerRoute
module.exports.createToken = createToken
module.exports.createTokenFromUser = createTokenFromUser
module.exports.getIdentity = getIdentity
module.exports.checkRole = checkRole

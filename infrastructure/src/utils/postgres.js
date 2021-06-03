const generate = require('nanoid/generate')
const { Client } = require('pg')

const { logger } = require('./logging')
require('./path_env')

const { PG_URI, TIME_ID_CHARS } = process.env
const TIME_ID_CHARS_INT = parseInt(TIME_ID_CHARS || '1', 10)
logger.info(`Postgres is configured to connect ${PG_URI}`)
let cachedDb = null

const stageSortByDateDesc = { $sort: { 'info.date': -1 } }
const stagePublishedPoll = { $match: { 'info.published': true, type: 'poll' } }

function stageLimit(n) { return { $limit: n } }

function stageId(id) { return { $match: { _id: id } } }

function stageSlug(slug) { return { $match: { 'info.slug': slug } } }

function stageTag(tag) { return { 'info.tags': { $in: [tag] } } }

function stageMyPollVote(userId, pollId) {
  if (pollId) {
    return {
      $lookup: {
        from: 'poll_votes',
        pipeline: [{
            $match: {
              $and: [
                { item: pollId },
                { user: userId }
              ]
            }
          },
          { $project: { _id: 0, vote: '$vote' } }
        ],
        as: 'me'
      }
    }
  }
  return {
    $lookup: {
      from: 'poll_votes',
      let: { poll_id: '$_id' },
      pipeline: [{
          $match: {
            $and: [
              { $expr: { $eq: ['$item', '$$poll_id'] } },
              { user: userId }
            ]
          }
        },
        { $project: { _id: 0, vote: '$vote' } }
      ],
      as: 'me'
    }
  }
}

function stageCommentVotes() {
  return {
    $lookup: {
      from: 'comment_votes',
      localField: '_id',
      foreignField: 'commentId',
      as: 'votes'
    }
  }
}

function stageReduceCommentData() {
  return {
    $project: {
      itemId: 0,
      source: 0,
      'votes._id': 0,
      'votes.commentId': 0
    }
  }
}

async function connectToDatabase() {
  logger.debug('Connect to postgres database')

  if (!!cachedDb && !!cachedDb.topology && cachedDb.topology.isConnected()) {
    logger.debug('Using cached database instance')
    return Promise.resolve(cachedDb)
  }
  const client = new Client({
    connectionString: PG_URI
  })
  await client.connect()
    .then((db) => {
      logger.debug('Successful connect')
      cachedDb = db
      return cachedDb
    })
    .catch((err) => {
      logger.error('Connection error occurred: ', err)
      throw err
    })

  return client
}

async function findUser(dbClient, params) {
  let text = 'SELECT users.*, roles.role_name FROM users INNER JOIN roles ON users.role_id=roles.role_id WHERE '
  const values = []

  if (params.user_id) {
    text += 'user_id = $1'
    values.push(params.user_id)
  }
  if (params.email) {
    text += 'email = $1'
    values.push(params.email)
  }
  if (params.verify_token) {
    text += 'verify_token = $1'
    values.push(params.verify_token)
  }

  try {
    const res = await dbClient.query(text, values)
    return res.rows[0]
  } catch (err) {
    return err.stack
  }
}

async function getAllUserName(dbClient) {

  const text = 'SELECT users.username FROM users WHERE verified = true'
  const result = []
  try {
    const res = await dbClient.query(text)
    res.rows.forEach(item => result.push(item.username))
    return result
  } catch (err) {
    return err.stack
  }
}

async function getAllUser(dbClient) {

  const text = `SELECT users.user_id, username, email, created_on, last_login, email_verification, users.role_id, verified, roles.role_name
  FROM users INNER JOIN roles ON users.role_id=roles.role_id ORDER BY created_on`
  try {
    const res = await dbClient.query(text)
    return res.rows
  } catch (err) {
    return err.stack
  }
}

async function getUserById(dbClient, userId) {

  const text = 'SELECT user_id, username, email, created_on, last_login, email_verification, users.role_id, verified FROM users WHERE users.user_id=$1'
  const values = [userId]
  try {
    const res = await dbClient.query(text, values)
    return res.rows[0]
  } catch (err) {
    return err.stack
  }
}

async function setLastLogin(dbClient, user) {
  const text = 'UPDATE users SET last_login = $1 WHERE user_id=$2'
  const values = [new Date(), user.user_id]
  try {
    const res = await dbClient.query(text, values)
    return res.rows[0]
  } catch (err) {
    return err.stack
  }
}

async function getTags(dbClient) {
  const text = 'SELECT * FROM tags'
  try {
    const res = await dbClient.query(text)
    return res.rows
  } catch (err) {
    return err.stack
  }
}

async function createTag(dbClient, tagName) {
  const text = 'INSERT INTO tags(tag_name) VALUES ($1) RETURNING *'
  const values = [tagName]
  try {
    const res = await dbClient.query(text, values)
    return res.rows
  } catch (err) {
    return err.stack
  }
}

async function getCategories(dbClient) {
  const text = 'SELECT * FROM category'
  try {
    const res = await dbClient.query(text)
    return res.rows
  } catch (err) {
    return err.stack
  }
}

async function createCategory(dbClient, categoryName) {
  const text = 'INSERT INTO category(category_name) VALUES ($1) RETURNING *'
  const values = [categoryName]
  try {
    const res = await dbClient.query(text, values)
    return res.rows
  } catch (err) {
    return err.stack
  }
}


async function getCategoryById(dbClient, id) {
  const text = 'SELECT category_name FROM category WHERE category_id = $1'
  const values = [id]

  const result = []
  const res = await dbClient.query(text, values)

  res.rows.forEach(item => {
    result.push(item.category_name)
  })
  return result
}

async function getBlogSlugList(dbClient, blogId, type) {
  let text = ''

  if (type === 'referring') {
    text = 'SELECT referring.referring_id as id FROM blogs INNER JOIN referring ON blogs.blog_id = referring.blog_id WHERE blogs.blog_id = $1'
  } else {
    text = 'SELECT related.related_id as id FROM blogs INNER JOIN related ON blogs.blog_id = related.blog_id WHERE blogs.blog_id = $1'
  }

  const values = [blogId]

  const result = []
  const res = await dbClient.query(text, values)


  for (let i = 0; i < res.rows.length; i++) {
    result.push(await getSlugById(dbClient, res.rows[i].id))
  }
  return result
}

async function getSlugById(dbClient, id) {
  const text = 'SELECT slug FROM blogs WHERE blog_id = $1'
  const values = [id]

  const res = await dbClient.query(text, values)

  return res.rows[0].slug
}

async function isDupSlug(dbClient, slug, id) {
  const text = 'SELECT slug FROM blogs WHERE slug=$1 AND blog_id<>$2'
  const values = [slug, id]

  const res = await dbClient.query(text, values)
  return res.rows.length > 0
}


// counterpart for authenticate.getIdentity()
function getIdentity(dbClient, userId) {
  const query = { _id: userId }
  return dbClient.db()
    .collection('users')
    .findOne(query, { projection: { 'bio.nickname': 1 } })
    .then(user => ((user === null) ? null : { userId: user._id, nickname: user.bio.nickname }))
}


async function getBlog(dbClient, blogId) {
  const text = 'SELECT blogs.*, users.username FROM blogs INNER JOIN users ON users.user_id = blogs.user_id WHERE blog_id = $1'
  const values = [blogId]

  const res = await dbClient.query(text, values)
  return res.rows[0]
}

async function getBlogBySlug(dbClient, slug) {
  const text = 'SELECT blogs.*, users.username FROM blogs INNER JOIN users ON users.user_id=blogs.user_id WHERE slug=$1'
  const values = [slug]

  const res = await dbClient.query(text, values)
  return res.rows[0]
}

async function getTagList(dbClient, blogId) {
  const text = 'SELECT tags.tag_name FROM tags INNER JOIN blogtags ON tags.tag_id = blogtags.tag_id WHERE blogtags.blog_id = $1'
  const values = [blogId]

  const result = []
  const res = await dbClient.query(text, values)

  res.rows.forEach(item => {
    result.push(item.tag_name)
  })
  return result
}

async function getTagById(dbClient, id) {
  const text = 'SELECT tag_name FROM tags WHERE tag_id = $1'
  const values = [id]

  const result = []
  const res = await dbClient.query(text, values)

  res.rows.forEach(item => {
    result.push(item.tag_name)
  })
  return result
}


async function getPoll(dbClient, pipeline) {
  const cursor = dbClient.db().collection('items').aggregate(pipeline)
  const item = await cursor.next()
  if (item == null) {
    return null
  }
  return processPoll(item)
}

async function getCMS(dbClient, pipeline) {
  const cursor = dbClient.db().collection('items').aggregate(pipeline)
  const item = await cursor.next()
  return item
}

function processPoll(item) {
  item.votes = item.data.votes
  delete item.data.votes
  item.votes.total = item.votes.neutral + item.votes.trivial + item.votes.dislike + item.votes.hate
  if (item.me && item.me[0]) {
    item.my_vote = item.me[0].vote
  }
  delete item.me
  return item
}

function getNeighbourhItem(dbClient, type, published, older) {
  let dateExpression, sortExpression
  if (older) {
    dateExpression = { $lt: published }
    sortExpression = { 'info.date': -1 }
  } else {
    dateExpression = { $gt: published }
    sortExpression = { 'info.date': 1 }
  }
  return dbClient.db().collection('items')
    .find({ type, 'info.published': true, 'info.date': dateExpression }, { projection: { info: 1 } })
    .sort(sortExpression)
    .limit(1)
}

// TODO remove and replace with postgres/mongo_setup.js
function setupIndexes(dbClient) {
  const db = dbClient.db()
  db.collection('users').createIndex({ 'auth.email': 1 }, { unique: true })
  db.collection('users').createIndex({ 'bio.nickname': 1 }, { unique: true })
  db.collection('items').createIndex({ 'info.type': 1 })
  db.collection('items').createIndex({ 'info.date': 1 })
  db.collection('items').createIndex({ 'info.slug': 1 }, { unique: true })
  db.collection('poll_votes').createIndex({ item: 1, user: 1 }, { unique: true })
  db.collection('comments').createIndex({ itemId: 1 })
  db.collection('comments').createIndex({ parentId: 1 })
  db.collection('comment_votes').createIndex({ commentId: 1, 'user.id': 1 }, { unique: true })
  db.collection('link_shares').createIndex({ user: 1 })
  db.collection('link_shares').createIndex({ date: 1 })
  db.collection('user_activity').createIndex({ userId: 1 })
  db.collection('user_activity').createIndex({ date: 1 })
}

// Takes milliseconds and appends a random character to avoid sub-millisecond conflicts, e.g. 1dvfc3nt84
// Use TIME_ID_CHARS to fine tune number of random characters
function generateTimeId() {
  let id = Date.now().toString(32)
  for (let i = 0; i < TIME_ID_CHARS_INT; i += 1) {
    id += Math.round(Math.random() * 35).toString(36)
  }
  return id
}

function generateId(idLength = 10) {
  return generate('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz', idLength)
}

function close() {
  if (cachedDb) {
    logger.info('Closing the cached postgres client')
    cachedDb.end()
  }
}

exports.connectToDatabase = connectToDatabase
exports.generateId = generateId
exports.generateTimeId = generateTimeId
exports.findUser = findUser
exports.getAllUserName = getAllUserName
exports.getAllUser = getAllUser
exports.getUserById = getUserById
exports.setLastLogin = setLastLogin
exports.getTags = getTags
exports.getTagList = getTagList
exports.getTagById = getTagById
exports.createTag = createTag
exports.isDupSlug = isDupSlug

exports.getCategories = getCategories
exports.createCategory = createCategory
exports.getCategoryById = getCategoryById
exports.getSlugById = getSlugById
exports.getBlogSlugList = getBlogSlugList

exports.getIdentity = getIdentity
exports.getPoll = getPoll
exports.getBlog = getBlog
exports.getBlogBySlug = getBlogBySlug
exports.processPoll = processPoll
exports.getCMS = getCMS
exports.getNeighbourhItem = getNeighbourhItem
exports.stageSortByDateDesc = stageSortByDateDesc
exports.stageLimit = stageLimit
exports.stageMyPollVote = stageMyPollVote
exports.stageReduceCommentData = stageReduceCommentData
exports.stageCommentVotes = stageCommentVotes
exports.stagePublishedPoll = stagePublishedPoll
exports.stageSlug = stageSlug
exports.stageId = stageId
exports.stageTag = stageTag
exports.close = close
exports.setupIndexes = setupIndexes
  // exports.storeUserActivity = storeUserActivity
  // exports.incrementUserActivityCounter = incrementUserActivityCounter
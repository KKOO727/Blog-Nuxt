const express = require('express')
require('path')

const app = express()
app.use('/', express.static(`${__dirname}/dist/`))
app.use(express.json())

require('./handlers/blogs/createBlog')(app)
require('./handlers/blogs/updateBlog')(app)
require('./handlers/blogs/tagList')(app)
require('./handlers/blogs/categories')(app)
require('./handlers/blogs/getBlog')(app)
require('./handlers/blogs/getBlogs')(app)
require('./handlers/blogs/imageUpload')(app)
require('./handlers/users/createUser')(app)
require('./handlers/users/updateUser')(app)
require('./handlers/users/getUser')(app)
require('./handlers/users/authorizeUser')(app)

app.all('*', (req, res) => {
  try {
    res.sendFile(`${__dirname}/dist/index.html`)
  } catch (error) {
    res.json({ success: false, message: 'Something went wrong' })
  }
})

module.exports = app

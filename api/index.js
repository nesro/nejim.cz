require('dotenv').config()
const { v4 } = require('uuid')
const express = require('express')
const userRouter = require('./routers/user')
require('./db/mongoose')

const app = express()

app.use(express.json())
app.use(userRouter)

app.get('/api', (req, res) => {
  const path = `/api/item/${v4()}`
  res.setHeader('Content-Type', 'text/html')
  res.setHeader('Cache-Control', 's-max-age=1, stale-while-revalidate')
  res.end(`Hdddello! Go to item: <a href="${path}">${path}</a>`)
})

app.get('/api/item/:slug', (req, res) => {
  const { slug } = req.params
  res.end(`hehItem: ${slug}`)
})

module.exports = app

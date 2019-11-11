setTimeout(function() {
const express = require('express')
const cors = require('cors')
const api = require('./routes/api')
const getters = require('./database/getters')
const initialize = require('./database/initialize')

const app = express()

// configure cors
app.use(cors())

// configure router
app.use('/', api)

// create an error middleware
app.use((err, req, res, next) => {
  console.error(err)
  res.status(err.status).send({ error: err, message: err.message })
})

app.listen(process.env.PORT, process.env.HOST, async () => {
  await initialize()
  console.log(
    `Backend api for Bruce Analyzer listening on ${process.env.HOST}:${process.env.PORT}`
  )
})
}, 4000)

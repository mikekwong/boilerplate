const express = require('express')
const app = express()
const morgan = require('morgan')
const path = require('path')
const bodyParser = require('body-parser')

app.use(morgan('dev'))
// Once your browser gets your index.html, it often needs to request static assets from your server - these include javascript files, css files, and images.
app.use(express.static(path.join(__dirname, '../public')))
// Requests frequently contain a body - if you want to use it in req.body, then you'll need some middleware to parse the body.
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use('/api', require('./api')) // matches all requests to /api/index.js file

// Because we generally want to build single-page applications (or SPAs), our server should send its index.html for any requests that don't match one of our API routes.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'))
})
// Let's catch those 500 errors and log them out.
app.use((err, req, res, next) => {
  console.error(err)
  console.error(err.stack)
  res.status(err.status || 500).send(err.message || 'Internal server error')
})

const port = process.env.PORT || 3000 // this can be very useful if you deploy to Heroku!
app.listen(port, function () {
  console.log('Knock, knock')
  console.log("Who's there?")
  console.log(`Your server, listening on port ${port}`)
})

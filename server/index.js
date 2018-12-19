const express = require('express')
const app = express()
const morgan = require('morgan')
const path = require('path')
const bodyParser = require('body-parser')
const session = require('express-session')
const passport = require('passport')

// we will need our sequelize instance from somewhere
const db = require('../db/_db')
// configure and create our database store
const SequelizeStore = require('connect-session-sequelize')(session.Store)
// this means that we need to make sure our local NODE_ENV variable is in fact set to 'development'
// Node may have actually done this for you when you installed it! If not though, be sure to do that.
if (process.env.NODE_ENV === 'development') {
  require('./localSecrets') // this will mutate the process.env object with your secrets.
}
require('./auth/index') // run your app after you're sure the env variables are set.

const dbStore = new SequelizeStore({ db: db })

// sync so that our session table gets created
dbStore.sync()

// Session middleware
// Set it up so that if an environment variable called SESSION_SECRET exists, we use that as our secret instead of the insecure secret.
// Then, on our deployment server, we can set an environment variable called SESSION_SECRET with our real secret!
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'a wildly insecure secret',
    store: dbStore,
    resave: false,
    saveUninitialized: false
  })
)

// We need to initialize passport so that it will consume our req.session object
// Since passport sessions rely on an existing session architecture, make sure these middleware declarations come after the express session middleware (but before your API middleware).
app.use(passport.initialize())
app.use(passport.session())

// Passport also needs to know how to serialize/deserialize the user.
// Remember that serialization is usually only done once per session (after we invoke req.login, so that passport knows how to remember the user in our session store. Generally, we use the user's id.
passport.serializeUser((user, done) => {
  try {
    done(null, user.id)
  } catch (err) {
    done(err)
  }
})

// Deserialization runs with every subsequent request that contains a serialized user on the session - passport gets the key that we used to serialize the user, and uses this to re-obtain the user from our database.
passport.deserializeUser((id, done) => {
  User.findById(id)
    .then(user => done(null, user))
    .catch(done)
})

app.use(morgan('dev'))
// Once your browser gets your index.html, it often needs to request static assets from your server - these include javascript files, css files, and images.
app.use(express.static(path.join(__dirname, '../public')))
// Requests frequently contain a body - if you want to use it in req.body, then you'll need some middleware to parse the body.
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// auth and api routes
app.use('/api', require('./api')) // matches all requests to /api/index.js file
app.use('/auth', require('./auth'))

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

// const port = process.env.PORT || 3000 // this can be very useful if you deploy to Heroku!
// app.listen(port, function () {
//   console.log('Knock, knock')
//   console.log("Who's there?")
//   console.log(`Your server, listening on port ${port}`)
// })

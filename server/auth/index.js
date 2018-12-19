const router = require('express').Router()
const { User } = require('../db/_db')
const passport = require('passport')

module.exports = router

// route any requests that start with /google to your oauth.js router.
router.use('/google', require('./oauth'))

// On our front-end, we'll have some kind of "Log In With Google" button. When the click that, it should make a GET request to our server (something like "/auth/google").

// Handle requests at this route by redirecting to the Provider (in this case, Google).
router.get('/auth/google', passport.authenticate('google', { scope: 'email' }))
// Once our user "signs the contract" with Google, google will make a request to the callback that we've configured with them.
router.get(
  '/auth/google/callback',
  passport.authenticate('google', {
    successRedirect: '/',
    failureRedirect: '/login'
  })
)
// A login route that returning users will use. Don't forget to check their password! If there are any problems (user doesn't exist, wrong password), give 'em the 401.
router.put('/login', async (req, res, next) => {
  try {
    const user = await User.findOne({
      where: {
        email: req.body.email
        // password: req.body.password
      }
    })
    if (user) {
      req.login(user, err => (err ? next(err) : res.json(user)))
    } else {
      const err = new Error('Incorrect email or password!')
      err.status = 401
      throw err
    }
  } catch (err) {
    next(err)
  }
})
// a sign up route that will create a user. Once the user is created, it should be set as the user on the session.
router.post('/signup', (req, res, next) => {
  User.create(req.body)
    .then(user => {
      req.login(user, err => {
        if (err) next(err)
        else res.json(user)
      })
    })
    .catch(next)
})
// To log out, we need to destroy the user on our session. Passport makes this very easy by attaching a logout method to the request object.
router.delete('/logout', (req, res, next) => {
  req.logout()
  req.session.destroy(err => {
    if (err) return next(err)
    res.status(204).end()
  })
})
// We should also write a method that our app can use to fetch the logged-in user on our session. Our client will make this request every time the client application loads - this allows us to keep the user logged in on the client even after they refresh.

// Since passport attaches the session user to the request object, this should be straightforward as well.
router.get('/me', (req, res, next) => {
  res.json(req.user || {})
})

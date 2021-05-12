const { findUserById } = require('../routes/api/user/user.model')
const passport = require('passport')
require('dotenv').config()
const SECRET_PHRASE = process.env.SECRET_PHRASE
const { Strategy, ExtractJwt } = require('passport-jwt')
const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: SECRET_PHRASE,
}

passport.use(
  new Strategy(opts, async (payload, done) => {
    const user = await findUserById(payload.id)
    try {
      if (!user) {
        return done(new Error('User not found'), false)
      }
      if (!user?.token) {
        return done(null, false)
      } else {
        return done(null, user)
      }
    } catch (err) {
      return done(err, false)
    }
  })
)

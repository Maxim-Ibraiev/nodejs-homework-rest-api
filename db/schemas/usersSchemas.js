const { Schema, model } = require('mongoose')
const bcrypt = require('bcryptjs')
const gravatar = require('gravatar')
require('dotenv').config()
const SALT = Number(process.env.URL_DB)

const UserSchema = new Schema({
  password: {
    type: String,
    required: [true, 'Password is required'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
  },
  subscription: {
    type: String,
    enum: ['starter', 'pro', 'business'],
    default: 'starter',
  },
  token: {
    type: String,
    default: null,
  },
  avatarURL: {
    type: String,
    default: function () {
      return gravatar.url(this.email, { s: '250' }, true)
    },
  },
  verify: {
    type: Boolean,
    default: false,
  },
  verifyToken: {
    type: String,
    required: [true, 'Verify token is required'],
  },
})

UserSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, bcrypt.genSaltSync(SALT))
  }

  next()
})

UserSchema.methods.validPassword = async function (password) {
  return await bcrypt.compare(password, this.password)
}

UserSchema.methods.getAvatarFileName = async function () {
  const arrOfURL = this.avatarURL?.split('/')

  return arrOfURL[arrOfURL.length - 1]
}

module.exports = model('users', UserSchema)

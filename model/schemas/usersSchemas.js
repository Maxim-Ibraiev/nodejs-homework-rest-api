const { Schema, model } = require('mongoose')
const bcrypt = require('bcryptjs')
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

module.exports = model('users', UserSchema)

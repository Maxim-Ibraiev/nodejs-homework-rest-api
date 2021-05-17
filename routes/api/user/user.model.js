const User = require('../../../db/schemas/usersSchemas')

const createUser = async (body) => await User.create(body)

const findUser = async (query) => await User.findOne(query)

const findUserById = async (id) => await User.findById({ _id: id })

const findUserByVerifyToken = async (verificationToken) =>
  await User.findOne({ verifyToken: verificationToken })

const updateValueByEmail = async (email, value) =>
  User.updateOne({ email }, value)

const setPassword = async (password) => await User.setPassword(password)

const updateAvatar = async (_id, avatarURL) =>
  await User.updateOne({ _id }, { avatarURL })

module.exports = {
  findUser,
  findUserById,
  findUserByVerifyToken,
  createUser,
  updateValueByEmail,
  updateAvatar,
  setPassword,
}

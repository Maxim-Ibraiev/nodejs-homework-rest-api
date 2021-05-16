const User = require('../../../db/schemas/usersSchemas')

const createUser = async (body) => await User.create(body)

const findUser = async (query) => await User.findOne(query)

const findUserById = async (id) => await User.findById({ _id: id })

const updateValueByEmail = async (obj, value) =>
  User.updateOne({ email: obj.email }, value)

const setPassword = async (password) => await User.setPassword(password)

const updateAvatar = async (_id, avatarURL) =>
  await User.updateOne({ _id }, { avatarURL })

module.exports = {
  createUser,
  findUser,
  updateValueByEmail,
  setPassword,
  findUserById,
  updateAvatar,
}

const User = require('../../../model/schemas/usersSchemas')

const createUser = async (body) => await User.create(body)

const findUser = async (query) => await User.findOne(query)

const findUserById = async (id) => await User.findById({ _id: id })

const updateValue = async (obj, value) =>
  User.updateOne({ email: obj.email }, value)

const setPassword = async (password) => await User.setPassword(password)

module.exports = {
  createUser,
  findUser,
  updateValue,
  setPassword,
  findUserById,
}

const { validationResult } = require('express-validator')
const { createUser, findUser, updateValue } = require('./user.model')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

const addUser = async (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({
      Status: '400 Bad Request',
      'Content-Type': 'application/json',
      ResponseBody: errors.errors[0].msg,
    })
  }

  const userAlreadyExist = await findUser({ email: req.body.email })

  if (userAlreadyExist) {
    return res.status(409).json({
      Status: '409 Conflict',
      'Content-Type': 'application/json',
      ResponseBody: { message: 'Email in use' },
    })
  }

  try {
    const createdUser = await createUser(req.body)

    res.status(201).json({
      Status: '201 Created',
      'Content-Type': 'application/json',
      ResponseBody: { user: createdUser },
    })
  } catch (error) {
    next(error)
  }
}

const login = async (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({
      Status: '400 Bad Request',
      'Content-Type': 'application/json',
      ResponseBody: errors.errors[0].msg,
    })
  }

  const user = await findUser({ email: req.body.email })
  const isSamePassword =
    user && bcrypt.compareSync(req.body.password, user.password)
  if (isSamePassword) {
    const userResult = {
      email: user.email,
      subscription: user.subscription,
      id: user._id,
    }
    const secretPhrase = process.env.SECRET_PHRASE
    const token = jwt.sign(userResult, secretPhrase)

    await updateValue(user, { token })

    return res.status(200).json({
      Status: '200 OK',
      'Content-Type': 'application/json',
      ResponseBody: {
        token,
        user: userResult,
      },
    })
  }

  res.status(401).json({
    Status: '401 Unauthorized',
    ResponseBody: {
      message: 'Email or password is wrong',
    },
  })
}

const logout = async (req, res, next) => {
  updateValue(req.user, { token: null })

  res.status(204).json({})
}

const current = async (req, res, next) => {
  res.status(200).json({
    Status: '200 OK',
    'Content-Type': 'application/json',
    ResponseBody: {
      email: req.user.email,
      subscription: req.user.subscription,
    },
  })
}

module.exports = { login, addUser, logout, current }

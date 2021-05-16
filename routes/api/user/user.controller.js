const path = require('path')
const fs = require('fs').promises
const { validationResult } = require('express-validator')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const gravatar = require('gravatar')
const Jimp = require('jimp')
const {
  uploadDir,
  storeImage,
  getAvatarURL,
} = require('../../../config/globalConst')

const User = require('./user.model')

const addUser = async (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({
      Status: '400 Bad Request',
      'Content-Type': 'application/json',
      ResponseBody: errors.errors[0].msg,
    })
  }

  const userAlreadyExist = await User.findUser({ email: req.body.email })

  if (userAlreadyExist) {
    return res.status(409).json({
      Status: '409 Conflict',
      'Content-Type': 'application/json',
      ResponseBody: { message: 'Email in use' },
    })
  }

  try {
    req.body.avatarURL = gravatar.url(req.body.email, {
      s: '200',
    })
    const createdUser = await User.createUser(req.body)

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

  const user = await User.findUser({ email: req.body.email })
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

    await User.updateValueByEmail(user, { token })

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
  User.updateValueByEmail(req.user, { token: null })

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

const updateAvatar = async (req, res, next) => {
  const { id } = req.user
  const { description } = req.body
  const { path: temporaryName, originalname } = req.file
  const fileName = path.join(uploadDir, originalname)
  try {
    await fs.rename(temporaryName, fileName)
  } catch (err) {
    await fs.unlink(temporaryName)
    return next(err)
  }

  const newAvatarName = `${id}__${originalname}`
  const avatarURL = getAvatarURL(newAvatarName)
  const newFilePath = path.join(storeImage, newAvatarName)

  Jimp.read(fileName)
    .then((avatar) => {
      return avatar
        .contain(250, 250, Jimp.HORIZONTAL_ALIGN_LEFT | Jimp.VERTICAL_ALIGN_TOP)
        .quality(60)
        .write(newFilePath)
    })
    .then(() => User.updateAvatar(id, avatarURL))
    .then(async () =>
      fs.unlink(path.join(storeImage, await req.user.getAvatarFileName()))
    )
    .catch((err) => {
      console.error(err)
      next(err)
    })

  res.json({
    Status: '200 OK',
    'Content-Type': 'application/json',
    ResponseBody: {
      avatarURL: avatarURL,
    },
  })
}

module.exports = { login, addUser, logout, current, updateAvatar }

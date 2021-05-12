const express = require('express')
const router = express.Router()
const { body } = require('express-validator')
const asyncHandler = require('express-async-handler')
const { login, addUser, logout, current } = require('./user.controller.js')
const guard = require('../middleware/guard')

router.post(
  '/signup',
  body('email').isEmail().isString(),
  body('password').isLength({ min: 3 }).isString(),
  asyncHandler(addUser)
)

router.post(
  '/login',
  body('email').isEmail().isString(),
  body('password').isLength({ min: 3 }).isString(),
  asyncHandler(login)
)

router.post('/logout', guard, asyncHandler(logout))
router.post('/current', guard, asyncHandler(current))

module.exports = router

const express = require('express')
const router = express.Router()
const { body } = require('express-validator')
const asyncHandler = require('express-async-handler')
const {
  login,
  addUser,
  logout,
  current,
  updateAvatar,
  verify,
  verifyAgain,
} = require('./user.controller.js')
const guard = require('../middleware/guard')
const upload = require('../middleware/multer')

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

router.patch(
  '/avatars',
  guard,
  upload.single('avatar'),
  asyncHandler(updateAvatar)
)

router.get('/verify/:verificationToken', asyncHandler(verify))
router.post(
  '/verify/',
  body('email').isEmail().isString(),
  asyncHandler(verifyAgain)
)

// router.post('/verify/', asyncHandler)

module.exports = router

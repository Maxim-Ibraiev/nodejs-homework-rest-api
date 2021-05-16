const path = require('path')

module.exports = {
  uploadDir: path.join(process.cwd(), 'tmp', 'uploads'),
  storeImage: path.join(process.cwd(), 'public/', 'avatars'),
  getAvatarURL: (avatarName) =>
    `http://localhost:${process.env.PORT || 3000}/avatars/${avatarName}`,
}

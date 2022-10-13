
const path = require('path')
const sourcePath = require('app-root-path').path
const multer = require('multer')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(sourcePath, 'src/public/img/products'))
      },
      filename: function (req, file, cb) {
        const filename = Date.now() + '-' + Math.round(Math.random() * 1E9) 
        cb(null, filename + '-' + file.originalname)
      }
})

module.exports = storage

const path = require('path')
const sourcePath = require('app-root-path').path
const multer = require('multer')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(sourcePath, 'src/public/img/category'))
      },
      filename: function(req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
})

module.exports = storage
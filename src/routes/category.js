const express = require('express')
const multer = require('multer')
const route = express.Router()

const storage = require('../app/middleware/category')
const filter = require('../app/helpers/validationImg')

const upload = multer({storage: storage, fileFilter: filter.imageFilter})

const categoryController = require('../app/controllers/CategoryController')

route.get('/add', categoryController.index)

route.post('/add',upload.single('icon'), categoryController.createCategory)

route.get('/list', categoryController.getCategory)

route.get('/edit/:slug',categoryController.editCategory)

route.put('/edit/:slug',upload.single('icon'),categoryController.handleEdit)

route.get('/restore/:slug', categoryController.restoreCategory)


route.get('/deleteList' , categoryController.listDelete)


route.get('/delete/:slug',categoryController.deleteCategory)

route.get('/destroy/:slug',categoryController.destroyCategory)




module.exports  = route
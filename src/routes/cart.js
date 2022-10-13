const express = require('express')
const route = express.Router()

const cartController = require('../app/controllers/CartController')


route.get('/handleCart',cartController.listCart)

module.exports  = route
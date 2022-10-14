const express = require('express')
const route = express.Router()

const cartController = require('../app/controllers/CartController')


route.get('/handleCart',cartController.listCart)

route.get('/accessCart/:id_cart',cartController.accessCart)

route.get('/cancelCart/:id_cart',cartController.cancelCart)

route.get('/listSuccess',cartController.orderSucces)

route.get('/listFailer',cartController.failerList)


module.exports  = route
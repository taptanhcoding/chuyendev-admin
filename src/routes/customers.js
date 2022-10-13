const express = require('express')
const route = express.Router()

const customerController = require('../app/controllers/CustomerController')

route.get('/usered', customerController.listCustomer)
route.get('/deleteList', customerController.deleteCustomer)
route.get('/active/:customer_id', customerController.activeCustomer)
route.get('/delete/:customer_id', customerController.handleDelete)
route.get('/destroy/:customer_id', customerController.handleDestroy)
route.get('/restore/:customer_id', customerController.handleRestore)

module.exports  = route 



const express = require('express')
const router = express.Router() 

const siteController = require('../app/controllers/SiteController')

router.post('/admin/login',siteController.loginAdmin)


router.get('/home', siteController.index)


module.exports = router
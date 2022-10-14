

var AdminMiddleware = require('../app/middleware/admin')

const express = require('express')
const router = express.Router() 

const siteController = require('../app/controllers/SiteController')

router.post('/admin/login',siteController.loginAdmin)
router.get('/admin/logout',siteController.logoutAdmin)


router.get('/',AdminMiddleware, siteController.index)


module.exports = router
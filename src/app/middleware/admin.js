const Admin = require("../models/Admin");
const {verifyToken} = require('../middleware/JWTHandle')

module.exports = function CheckLogin(req,res,next) {
    if(req.cookies.token) {
        let usernameAdmin = verifyToken(req.cookies.token)
        Admin.findOne({username : usernameAdmin.username})
                .then(admin => {
                    if(admin) {
                        next()
                    }
                    else {
                        res.render('login', {layout: false})
                    }
                })
                .catch(err => console.log(err))
    }
    else {
        res.render('login', {layout: false})
    }
}
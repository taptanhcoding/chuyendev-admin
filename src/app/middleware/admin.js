module.exports = function AdminMiddleware(req,res,next) {
    
    if(req.body.isLogin) {
        res.locals.isLogin = req.body.isLogin
    }

    next() 
    
}
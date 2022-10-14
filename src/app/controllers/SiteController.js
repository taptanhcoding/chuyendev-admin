const { MongooseToObject } = require("../../util/mongose");
const Admin = require("../models/Admin");
const { createJWT } = require("../middleware/JWTHandle");


class SiteController {
  //[GET] /home
  index(req, res, next) {
    res.render("home");
  }

  //[POST] /admin/login
  loginAdmin(req, res, next) {
    Admin.findOne({ username: req.body.username, password: req.body.password })
      .then((admin) => {
        let adminDetail = MongooseToObject(admin);
        if(admin) {
          let token = createJWT({username: adminDetail.username})
          res.cookie('token', token, { expires: new Date(Date.now() + 90000000)})
            res.render('home',{admin : adminDetail})
        } else res.redirect("/");
      })
      .catch((err) => console.log(err));
  }


  //[GET] /admin/logout
  logoutAdmin(req, res, next) {
    try {
      res.clearCookie('token');
      res.redirect('/')
    }
    catch(err) {
      console.log(err);
    }
  }
}

module.exports = new SiteController();

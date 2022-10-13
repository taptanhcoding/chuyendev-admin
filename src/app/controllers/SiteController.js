const { MongooseToObject } = require("../../util/mongose");
const Admin = require("../models/Admin");

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
        if(Object.keys(adminDetail)) {
            res.render('home',{admin : adminDetail})
        } else res.redirect("/");
      })
      .catch((err) => console.log(err));
  }
}

module.exports = new SiteController();

const {
  MongooseToObject,
  multipleMongooseToObject,
} = require("../../util/mongose");
const { paging } = require("../helpers/validationImg");
const Customer = require("../models/Customer");
const Cart = require("../models/Orders");
const { createJWT, verifyToken } = require("../middleware/JWTHandle");
const { SignInConfirm } = require("../helpers/nodemailer");

class CustomerController {
  //[GET] /customer/list?page=x
  listCustomer(req, res, next) {
    Promise.all([
      Customer.find({}),
      Customer.count({}),
      Customer.countDeleted(),
    ])
      .then(([customer, count, countDeleted]) => {
        let listCustomer = [];
        if (req.query.page) {
          listCustomer = paging(customer, count, req.query.page);
        } else listCustomer = multipleMongooseToObject(customer);

        res.render("customer/list", { ...listCustomer, countDeleted });
      })
      .catch((err) => console.log(err));
  }

  //[GET] /customer/deleteList
  deleteCustomer(req, res, next) {
    Promise.all([Customer.findDeleted({}), Customer.countDeleted()])
      .then(([customer, count]) => {
        let listCustomer = [];
        if (req.query.page) {
          listCustomer = paging(customer, count, req.query.page);
        } else listCustomer = multipleMongooseToObject(customer);

        res.render("customer/list", { ...listCustomer });
      })
      .catch((err) => console.log(err));
  }



  //[GET] /customer/delete/:customer_id
  handleDelete(req, res, next) {
    Customer.delete({ _id: req.params.customer_id })
      .then(() => res.redirect("back"))
      .catch((err) => console.log(err));
  }

  //[GET] /customer/destroy/:customer_id
  handleDestroy(req, res, next) {
    Customer.deleteOne({ _id: req.params.customer_id })
      .then(() => res.redirect("back"))
      .catch((err) => console.log(err));
  }

  //[GET] /customer/restore/:customer_id
  handleRestore(req, res, next) {
    Customer.restore({ _id: req.params.customer_id })
      .then(() => res.redirect("back"))
      .catch((err) => console.log(err));
  }

  //api ------------------------------------------------------------------------
  //[GET] /api/user/login
  login(req, res, next) {
    Customer.findOne({_id : req.token._id})
              .then(customer => {
                let account = MongooseToObject(customer)
                delete account.password
                res.status(200).send(account)
              })
              .catch(err => console.log(err))
  }

  //[POST] /api/user/login/
  handleLogin(req, res, next) {
    console.log(req.body);
    let email = req.body.email;
    let password = req.body.password;
    let customer = {};

    Customer.findOne({ $and: [{ email }, { password }] })
      .then(async(customer) => {
        if (customer) {
          let account = MongooseToObject(customer);
          let token = createJWT({_id: account._id})
          let warning= account.active? null : 'Vui Lòng Check Mail để xác nhận tài khoản mua hàng'
          Cart.findOne({user_id: account._id})
                .then(cart => {
                  const accountCart = MongooseToObject(cart)

                  res.status(200).send({token,warning,carts: accountCart.carts});
                })
                .catch(err => console.log(err))

        } else {
          res.send({});
        }
      })
      .catch((err) => console.log(err));
  }

  //[POST] /api/user/signin
  signin(req, res, next) {
    Customer.findOne({ email: req.body.email })
      .then((customer) => {
        let oldCustomer = MongooseToObject(customer);
        if (oldCustomer) {
          res.send({});
        } else {
          let email = req.body.email.toLowerCase();
          const account = { ...req.body, email };
          const user = new Customer(account);
          user
            .save()
            .then(() => {
              let token = createJWT({email})
              SignInConfirm({email,token})
              Customer.findOne({ email: req.body.email })
                        .then(customer => {
                          let newCustomer = MongooseToObject(customer)
                          let newCart = {
                            user_id : newCustomer._id,
                            carts: []
                          }
                          let createCart = new Cart(newCart)
                          createCart.save()
                        })
                        .catch(err => console.log(err))

            })
            .then(() => res.status(201).send(account))
            .catch((err) => console.log(err));
        }
      })
      .catch((err) => console.log(err));
  }

    //[GET] /api/user/active/:token
    activeCustomer(req, res, next) {
      Customer.updateOne(
        { email: req.token.email },
        {
          $set: {
            active: true,
          },
        }
      )
        .then(() => res.status(200).json({status: true,message:'Xác minh thành công !'}))
        .catch((err) => res.json({status: false,message: 'xác minh thất bại'}));
    }

  // [PUT] /api/user/:user_id/update
  update(req, res, next) {
    Customer.updateOne({ _id: req.params.user_id }, req.body)
      .then(() => res.send(req.body))
      .catch((err) => console.log(err));
  }

}

module.exports = new CustomerController();

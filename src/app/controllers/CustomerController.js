const {
  MongooseToObject,
  multipleMongooseToObject,
} = require("../../util/mongose");
const { paging } = require("../helpers/validationImg");
const Customer = require("../models/Customer");
const Cart = require("../models/Orders");

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

  //[GET] /customer/active/:customer_id
  activeCustomer(req, res, next) {
    Customer.updateOne(
      { _id: req.params.customer_id },
      {
        $set: {
          active: true,
        },
      }
    )
      .then(() => res.redirect("back"))
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
  //[POST] /api/user/login
  login(req, res, next) {
    res.send(req.token);
  }

  //[GET] /api/user/login/:token
  handleLogin(req, res, next) {
    console.log(req.me);
    let email = req.me.email;
    let password = req.me.password;
    let customer = {};

    Customer.findOne({ $and: [{ email }, { password }] })
      .then(async(customer) => {
        if (customer) {
          let account = MongooseToObject(customer);
          Cart.findOne({user_id: account._id})
                .then(cart => {
                  const accountCart = MongooseToObject(cart)
                  res.status(200).send({...account,carts: accountCart.carts});
                })
                .catch(err => console.log(err))
                // res.status(200).send(account);

        } else {
          res.send({});
        }
      })
      .catch((err) => console.log(err));
  }

  //[POST] /api/user/signin
  signin(req, res, next) {
    Customer.findOne({ email: req.me.email })
      .then((customer) => {
        let oldCustomer = MongooseToObject(customer);
        if (oldCustomer) {
          res.send({});
        } else {
          let email = req.me.email.toLowerCase();
          const account = { ...req.me, email };
          const user = new Customer(account);
          user
            .save()
            .then(() => {
              Customer.findOne({ email: req.me.email })
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

  // [PUT] /api/user/:user_id/update
  update(req, res, next) {
    Customer.updateOne({ _id: req.params.user_id }, req.me)
      .then(() => res.send(req.me))
      .catch((err) => console.log(err));
  }

}

module.exports = new CustomerController();

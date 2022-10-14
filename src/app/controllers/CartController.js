const {
  MongooseToObject,
  multipleMongooseToObject,
} = require("../../util/mongose");
const { paging } = require("../helpers/validationImg");
const Cart = require("../models/Orders");
const Orders = require("../models/Cart");
const Product = require("../models/Product");
const { OrderConfirm } = require("../helpers/nodemailer");
class CartController {
  //[GET] /cart-admin/handleCart?page=1
  listCart(req, res, next) {
    Promise.all([Orders.find({status: false}), Orders.count({status: false})])
      .then(([carts, count]) => {
        let page = req.params.page || 1;
        let pagingCart = paging(carts, count, page);
        console.log(pagingCart);
        res.render("cart/list", pagingCart);
      })
      .catch((err) => console.log(err));
  }
  //[GET] /cart-admin/accessCart/:id_cart
  accessCart(req, res, next) {
    Orders.updateOne(
      {
        order_id: req.params.id_cart,
      },
      {
        $set: {
          status: true,
        },
      }
    )
      .then(() => res.redirect("back"))
      .catch((err) => console.log(err));
  }

  //[GET] /cart-admin/cancelCart/:id_cart
  cancelCart(req, res, next) {
    Orders.delete({ order_id: req.params.id_cart })
      .then(() => res.redirect("back"))
      .catch((err) => console.log(err));
  }

  //[GET] /cart-admin/listSuccess?page=1
  orderSucces(req, res, next) {
    Promise.all([Orders.find({ status: true }), Orders.count({ status: true })])
      .then(([carts, count]) => {
        let page = req.params.page || 1;
        let pagingCart = paging(carts, count, page);
        console.log(pagingCart);
        res.render("cart/success", pagingCart);
      })
      .catch((err) => console.log(err));
  }

  //[GET] /cart-admin/listFailer?page=1
  failerList(req, res, next) {
    Promise.all([
      Orders.findDeleted({}),
      Orders.countDeleted({}),
    ])
      .then(([carts, count]) => {
        let page = req.params.page || 1;
        let pagingCart = paging(carts, count, page);
        console.log(pagingCart);
        res.render("cart/failer", pagingCart);
      })
      .catch((err) => console.log(err));
  }

  //api --------------------------------------------------------------------------
  //[POST] api/cart/add/:user_id
  addCart(req, res, next) {
    Cart.updateOne(
      { user_id: req.params.user_id },
      { $set: { carts: req.body.cart } }
    )
      .then(() => res.send({}))
      .catch((err) => console.log(err));
  }

  //[GET] api/api-cart/getcart/:user_id
  getCart(req, res, next) {
    Cart.findOne({ user_id: req.params.user_id })
      .then((cart) => {
        const userCart = MongooseToObject(cart);
        const cartArray = userCart.carts;
        res.send(cartArray);
      })
      .catch((err) => res.send({ err }));
  }

  //[] api/cart/order/:user_id
  orderCart(req, res, next) {
    const newOrder = new Orders(req.body);
    newOrder
      .save()
      .then(() => {
        Cart.updateOne({ user_id: req.params.user_id }, { $set: { carts: [] } })
          .then(() => {
            OrderConfirm(req.body);
            res.send({ nofication: "Đặt hàng thành công", status: true });
          })
          .catch((err) =>
            res.send({ nofication: "Đặt hàng thất bại 1", status: false })
          );
      })
      .catch((err) => console.log(err));
  }
}

module.exports = new CartController();

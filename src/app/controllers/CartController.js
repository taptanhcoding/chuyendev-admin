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
    Promise.all([Cart.find({ order: true }), Cart.count({ order: true })])
      .then(([carts, count]) => {
        let page = req.params.page || 1;
        let pagingCart = paging(carts, count, page);

        res.render("cart/list", pagingCart);
      })
      .catch((err) => console.log(err));
  }

  //api --------------------------------------------------------------------------
  //[POST] api/cart/add/:user_id
  addCart(req, res, next) {
    Cart.updateOne(
      { user_id: req.params.user_id },
      { $set: { carts: req.me.cart } }
    )
      .then(() => res.send({}))
      .catch((err) => console.log(err));
  }

  //[GET] api/api-cart/getcart/:user_id
  getCart(req, res, next) {
    Cart.findOne({ user_id: req.params.user_id })
      .then((cart) => {
        const userCart = MongooseToObject(cart);
        const cartArray = userCart.carts
        res.send(cartArray)
      })
      .catch((err) => res.send({ err }));
  }

  //[] api/cart/order/:user_id
  orderCart(req, res, next) {
    const newOrder = new Orders(req.me);
    newOrder
      .save()
      .then(() => {
        Cart.updateOne({ user_id: req.params.user_id }, { $set: { carts: [] } })
          .then(() => {
            OrderConfirm(req.me)
            res.send({ nofication: "Đặt hàng thành công", status: true });
          })
          .catch((err) =>
            res.send({ nofication: "Đặt hàng thất bại 1", status: false })
          );
      })
      .catch((err) =>
        console.log(err)
      );
  }
}

module.exports = new CartController();

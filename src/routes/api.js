const express = require("express");
const route = express.Router();
const { createJWT, verifyToken } = require("../app/middleware/JWTHandle");

const customerController = require("../app/controllers/CustomerController");
const productController = require("../app/controllers/ProductController");
const cartController = require("../app/controllers/CartController");
const categoryController = require("../app/controllers/CategoryController");

// customer

route.get("/user/login/:token",(req,res,next) => {
    req.token = verifyToken(req.params.token)
    next()
}, customerController.login);
route.post("/user/login", customerController.handleLogin);

route.post("/user/signin", customerController.signin);
route.get("/user/active/:token",(req,res,next) => {
    req.token = verifyToken(req.params.token)
    next()
}, customerController.activeCustomer);

route.put("/user/:user_id/update", customerController.update);

//category
route.get("/api-categories", categoryController.category);

// product


route.get("/api-product/detail/:slug", productController.detailProducts);
route.get("/api-product/product-id/:product_id", productController.detailProductId);

route.get("/api-product/sale/:category", productController.saleProducts);

route.get("/api-product/:category", productController.categoryProducts);

//Cart

route.post("/api-cart/addcart/:user_id", cartController.addCart);
route.get("/api-cart/getcart/:user_id", cartController.getCart);
route.post("/api-cart/ordercart/:user_id", cartController.orderCart);

//Search

route.get("/search", productController.searchProduct);

module.exports = route;

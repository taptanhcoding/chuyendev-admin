// const swaggerUi = require("swagger-ui-express");
// // const swaggerJsdoc = require('swagger-jsdoc')
// const swaggerDocument = require('../config/swaggerApi/openapi.json');
// const options = {
//   definition: {
//     openapi: '3.0.0',
//     info: {
//       title: 'ChuyenDev Api',
//       version: '1.0.0',
//     },
//   },
//   apis: ['./src/routes/api.js'],
// };

const siteRoute = require("./site");
const cartRoute = require("./cart");
const productRoute = require("./products");
const categoryRoute = require("./category");
const customerRoute = require("./customers");
const apiRoute = require('./api')

var AdminMiddleware = require('../app/middleware/admin')
const { createJWT, verifyToken } = require("../app/middleware/JWTHandle");

function route(app) {
  app.use("/api",apiRoute);
  app.use("/category",AdminMiddleware,categoryRoute);
  app.use("/product",AdminMiddleware, productRoute);
  app.use("/customer",AdminMiddleware, customerRoute);
  app.use("/cart-admin",AdminMiddleware, cartRoute);
  app.use("/",siteRoute);

}

module.exports = route;

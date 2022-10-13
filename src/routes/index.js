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

  // app.use("/api",swaggerUi.serve, swaggerUi.setup(swaggerDocument,options), apiRoute);
  app.use("/api",
  function (req, res, next) {
    req.token = createJWT(req.body);

    next();
  },
  function (req, res, next) {
    console.log(req.token);
    req.me = verifyToken(req.token);
    next();
  },apiRoute);

  app.use("/category", categoryRoute);
  app.use("/product", productRoute);
  app.use("/customer", customerRoute);
  app.use("/cart-admin", cartRoute);
  app.use("/",AdminMiddleware,siteRoute);

}

module.exports = route;

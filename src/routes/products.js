const express = require("express");
const multer = require("multer");
const route = express.Router();

const storage = require("../app/middleware/products");
const fileFilter = require("../app/helpers/validationImg");

const upload = multer({
  storage: storage,
  fileFilter: fileFilter.imageFilter,
});

const productController = require("../app/controllers/ProductController");

route.get("/add", productController.index);

route.post(
  "/add",upload.array("image"),productController.addProduct);

route.get('/list',productController.listProduct)

route.get('/deleted',productController.listDelete)

route.get('/edit/:product_id',productController.editProduct)

route.put('/edit/:product_id',upload.array("image"),productController.handleEdit)

route.get('/:product_id/delete' ,productController.deleteProduct)

route.get('/:product_id/destroy' ,productController.destroyProduct)

route.get('/:product_id/restore' ,productController.restoreProduct)


module.exports = route;

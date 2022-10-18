const Product = require("../models/Product");
const Category = require("../models/Category");
const {
  multipleMongooseToObject,
  MongooseToObject,
} = require("../../util/mongose");
const { paging } = require("../helpers/validationImg");
require("dotenv").config();

class ProductController {
  //[GET] /product/add
  index(req, res, next) {
    Category.find()
      .then((categories) =>
        res.render("products/add", {
          categories: multipleMongooseToObject(categories),
        })
      )
      .catch((err) => console.log(err));
  }

  //[POST] /product/add
  addProduct(req, res, next) {
    const host = process.env.URL_NODE_PUBLIC || process.env.URL_NODE_DEV;

    let image = [];
    Array.from(req.files).forEach((file) => {
      image = [...image, `${host}/img/products/${file.filename}`];
    });
    let color = req.body.color.split(";");
    req.body.image = image;
    req.body.color = color;
    // res.send(req.body)
    const product = new Product(req.body);
    product
      .save()
      .then(() => res.redirect("back"))
      .catch((err) => console.log(err));
  }

  //[GET] /product/edit/:product_id
  editProduct(req, res, next) {
    Promise.all([
      Product.findOne({ id: req.params.product_id }),
      Category.find({}),
    ])
      .then(([product, categories]) =>
        res.render("products/editProduct", {
          product: MongooseToObject(product),
          categories: multipleMongooseToObject(categories),
        })
      )
      .catch((err) => console.log(err));
  }

  //[PUT] /product/edit/:product_id
  handleEdit(req, res, next) {
    let image = [];
    const host = process.env.URL_NODE_PUBLIC || process.env.URL_NODE_DEV;

    if (req.files.length > 0) {
      Array.from(req.files).forEach((file) => {
        image = [...image, `https://raw.githubusercontent.com/taptanhcoding/chuyendev-admin/main/src/public/img/products/${file.filename}`];
      });
      req.body.image = image;
      delete req.body.old_image;
    } else {
      req.body.image = req.body.old_image.split(",");
      delete req.body.old_image;
    }

    let color = req.body.color.split(";");
    req.body.color = color;

    if (!req.body.description) {
      req.body.description = req.body.old_description;
      delete req.body.old_description;
    }

    // res.send({
    //   body: req.body,
    //   file: req.files
    // })

    Product.updateOne({ id: req.params.product_id }, req.body)
      .then(() => res.redirect("back"))
      .catch((err) => console.log(err));
  }

  //[GET] /product/deleted
  listDelete(req, res, next) {
    Promise.all([Product.findDeleted({}), Product.countDeleted({})]).then(
      ([deleteds, count]) => {
        if (req.params.page) {
          let newDeleted = paging(deleteds, count, req.params.page);
          res.render("products/deleteProduct", newDeleted);
        } else
          res.render("products/deleteProduct", {
            data: multipleMongooseToObject(deleteds),
          });
      }
    );
  }

  //[GET] /product/:product_id/delete
  deleteProduct(req, res, next) {
    Product.delete({ id: req.params.product_id })
      .then(() => res.redirect("back"))
      .catch((err) => console.log(err));
  }

  //[GET] /product/:product_id/restore
  restoreProduct(req, res, next) {
    Product.restore({ id: req.params.product_id })
      .then(() => res.redirect("back"))
      .catch((err) => console.log(err));
  }

  //[GET] /product/:product_id/destroy
  destroyProduct(req, res, next) {
    Product.deleteOne({ id: req.params.product_id })
      .then(() => res.redirect("back"))
      .catch((err) => console.log(err));

    Product.findOneDeleted({ id: req.params.product_id })
      .then((product) => {
        let deleProduct = MongooseToObject(product);
        handleDelete(deleProduct.image, "products/");
      })
      .then(() => {
        Product.deleteOne({ id: req.params.product_id })
          .then(() => res.redirect("back"))
          .catch((err) => console.log(err));
      })
      .catch((err) => console.log(err));
  }
  //[GET] /product/list?page=x
  listProduct(req, res, next) {
    Promise.all([Product.find().lean(), Product.count(), Product.countDeleted()])
      .then(([products, count, countDeleted]) => {
        let myProduct = paging(products, count, req.query.page);
        console.log({ ...myProduct, countDeleted });
        res.render("products/list", { ...myProduct, countDeleted });
      })
      .catch((err) => console.log(err));
  }
  // api --------------------------------------------------------------------------------
  //[GET] api/api-product/:category?page=
  categoryProducts(req, res, next) {
    Promise.all([
      Product.find({ categories: req.params.category }),
      Product.count({ categories: req.params.category }),
    ])
      .then(([products, count]) => {
        let page = Number.parseInt(req.query.page);
        let productCategory = paging(products, count, page,16);

        res.send(productCategory);
      })
      .catch((err) => res.send({ err }));
  }


  //[GET] api/api-product/sale/:category
  saleProducts(req, res, next) {
    Product.find({ categories: req.params.category })
      .sort({createdAt: 'desc'})
      .limit(8)
      .then((products) => {
        let productCategory = multipleMongooseToObject(products);

        res.send(productCategory);
      })
      .catch((err) => res.send({ err }));
  }

  //[GET] api/api-product/detail/:slug
  detailProducts(req, res, next) {
    Product.findOne({ slug: req.params.slug })
      .then((product) => {
        let Detail = MongooseToObject(product);
        res.send(Detail);
      })
      .catch((err) => res.send({ err }));
  }

  //[GET] api/api-product/product-id/:product_id
  detailProductId(req, res, next) {
    // res.send(req.params.product_id)
    Product.findOne({ id: req.params.product_id })
      .then((product) => {
        let Detail = MongooseToObject(product);
        res.send(Detail);
      })
      .catch((err) => res.send({ err }));
  }


  //[GET] api/search?q=x&page=y
  searchProduct(req, res, next) {
    Product.find()
      .then((products) => {
        console.log(typeof products);
        let newProducts = multipleMongooseToObject(products);
        let searchProducts = newProducts.filter((product) => {
          if (
            product.name.toLowerCase().includes(req.query.q.toLowerCase())
          ) {
            return true;
          } else return false;
        });

        if (req.query.page) {
          let page = Number.parseInt(req.query.page);
          let searchPage = paging(searchProducts, searchProducts.length, page,16);
          res.send(searchPage);
        } else {
          res.send(searchProducts);
        }
      })
      .catch((err) => console.log(err));
  }
}

module.exports = new ProductController();

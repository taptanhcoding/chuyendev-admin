const {
  multipleMongooseToObject,
  MongooseToObject,
} = require("../../util/mongose");
const { paging, handleDelete } = require("../helpers/validationImg");
const Category = require("../models/Category");
const Product = require("../models/Product");
require("dotenv").config();
const fs = require("fs");

class CategoryController {
  //[GET] /category/add
  index(req, res, next) {
    res.render("categorys/add");
  }

  //[POST] /category/add
  createCategory(req, res, next) {
    const host = process.env.URL_NODE_PUBLIC || process.env.URL_NODE_DEV;
    const categoryData = {};
    categoryData.name = req.body.name;
    categoryData.icon = host + "img/category/" + req.file.filename;

    const category = new Category(categoryData);

    category
      .save()
      .then(() => res.render("categorys/add"))
      .catch((err) => console.log(err));
  }

  //[GET] /category/list?page=x
  getCategory(req, res, next) {
    Promise.all([
      Category.find({}).lean(),
      Category.count({}),
      Category.countDeleted({}),
    ])
      .then(([categoryArray, count, countDeleted]) => {
        let categorys = paging(categoryArray, count, req.query.page);
        res.render("categorys/list", { ...categorys, countDeleted });
      })
      .catch((err) => res.send({ err }));
  }

  //[GET] /category/deleteList
  listDelete(req, res, next) {
    Category.findDeleted({})
      .then((deleteds) =>
        res.render("categorys/deleteCategory", {
          categorys: multipleMongooseToObject(deleteds),
        })
      )
      .catch((err) => console.log(err));
  }

  //[GET] /category/delete/:slug
  deleteCategory(req, res, next) {
    Category.delete({ slug: req.params.slug })
      .then(() => res.redirect("back"))
      .catch((err) => console.log(err));
  }

  //[GET] /category/destroy/:slug
  destroyCategory(req, res, next) {
    Category.findOneDeleted({ slug: req.params.slug })
      .then((category) => {
        let deleCate = MongooseToObject(category);
        handleDelete(deleCate, "category/");
      })
      .then(() => {
        Category.deleteOne({ slug: req.params.slug })
      .then(() => res.redirect("back"))
      .catch((err) => console.log(err));
      })
      .catch((err) => console.log(err));
    
  }

  //[GET] /category/edit/:slug
  editCategory(req, res, next) {
    Category.findOne({ slug: req.params.slug }).lean().then((category) =>
    {console.log(category);
      res.render("categorys/editCategory", {
        category: MongooseToObject(category),
      })}
    );
  }

  //[PUT] /category/edit/:slug
  handleEdit(req, res, next) {
    const host = process.env.URL_NODE_PUBLIC || process.env.URL_NODE_DEV;

    const categoryData = {};
    categoryData.name = req.body.name;

    if (req.file) {
      categoryData.icon = host + "img/category/" + req.file.filename;
    } else {
      categoryData.icon = req.body.old_icon;
    }

    Category.updateOne({ slug: req.params.slug }, categoryData)
      .then(() => res.redirect("back"))
      .catch((err) => console.log(err));
  }

  //[GET] /category/restore/:slug
  restoreCategory(req, res, next) {
    Category.restore({ slug: req.params.slug })
      .then(() => res.redirect("back"))
      .catch((err) => console.log(err));
  }

  // api -----------------------------------------------------------------------------

  //[GET] /api/api-categories
  category(req, res, next) {
    Category.find({})
      .then((categorys) => {
        let categories = multipleMongooseToObject(categorys);
        res.send(categories);
      })
      .catch((err) => res.send({ err }));
  }
}

module.exports = new CategoryController();

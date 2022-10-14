const { multipleMongooseToObject } = require("../../util/mongose");
const fs = require("fs");
const sourcePath = require("app-root-path").path;

exports.imageFilter = function (req, file, cb) {
  // Accept images only
  if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/)) {
    req.fileValidationError = "Only image files are allowed!";
    return cb(new Error("Only image files are allowed!"), false);
  }
  cb(null, true);
};

exports.paging = function (products, count, page, per_page = 6) {
  page = Number.parseInt(page);

  products = Array.isArray(products) ? products : multipleMongooseToObject(products) ;
  count = Number.parseInt(count);
  let total_pages;
  if (count < per_page) {
    total_pages = 1;
  } else {
    if (count % per_page > 0) total_pages = Math.floor(count / per_page) + 1;
    else total_pages = Math.floor(count / per_page);
  }

  let myProduct = {
    page,
    per_page,
    total: count,
    total_pages,
    data: [...products.slice(per_page * (page - 1), per_page * (page - 1) + per_page)],
  };

  return myProduct;
};

exports.handleDelete = (data, path) => {
  if (Array.isArray(data)) {
    data.forEach((child) => {
      let arrayName = child.split("/");
      let fileName = arrayName[arrayName.length - 1];
      fs.unlink("./src/public/img/" + path + fileName, function (err, data) {
        if (err) throw err;
        console.log("Delete file successfully");
      });
    });
  } else {
    console.log(data);
    let arrayName = data.icon.split("/");
    let fileName = arrayName[arrayName.length - 1];
    fs.unlink("./src/public/img/" + path + fileName, function (err, data) {
      if (err) throw err;
      console.log("Delete file successfully");
    });
  }
};

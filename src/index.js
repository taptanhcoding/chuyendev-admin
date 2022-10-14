const express = require("express");
const morgan = require("morgan");
const path = require("path");
var appRoot = require("app-root-path").path;
const { engine } = require("express-handlebars");
const cookieParser = require('cookie-parser')
const cors = require("cors");
require('dotenv').config()


var methodOverride = require("method-override");

const statusLogin = require('./app/middleware/JWTHandle')

const routes = require("./routes");
const db = require("./config/db");
const app = express();
const port = process.env.PORT || 4000;

console.log(app);
console.log(appRoot);

//test JWT

global.isLogin = false

app.engine(
  "hbs",
  engine({
    extname: "hbs",
    helpers: {
      paging(total, link) {
        let a = "";
        for (let i = 1; i <= total; i++) {
          a += `<a class="paging" href="${link}?page=${i}">${i}</a>`;
        }
        return "<div class='wrapper-paging'>" + a + "</div>";
      },
      arrayToString(array) {
        return array.join(";");
      },
      sameData(a, b) {
        console.log(a, b);
        return a == b;
      },
      oldImage(array) {
        let data = "";
        array.forEach((element) => {
          data += `<img src="${element}" />`;
        });
        return data;
      },
      selectedChoose(data, array) {
        let options = "";
        array.forEach((element) => {
          if (data == element.name) {
            options += `<option selected value="${element.name}">${element.name}</option>`;
          } else
            options += `<option value="${element.name}">${element.name}</option>`;
        });
        return options;
      },
      detailOrder(data) {
        let listProduct =``
        data.forEach(product => {
          listProduct += `<li>${product.name}(${product.color})x${product.quanity}(${product.total})</li>`
        })
        return `<ul style="list-style:none;padding-left: 0">${listProduct}</ul>`

      }
    },
  })
);

app.use(morgan("combined"));
app.use(express.static(path.join(appRoot, "src", "public/")));
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(
  express.json()
);


app.use(methodOverride("_method"));
app.use(cors());
app.use(cookieParser())



app.set("view engine", "hbs");
app.set("views", path.join(appRoot, "src", "resource", "views"));




routes(app);
db.connect();


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

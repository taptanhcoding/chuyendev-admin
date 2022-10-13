# thiết lập cơ bản

## 1 tạo pakage.json: npm init
## 2 cài đặt các depedences, devDependences cần thiết:
npm i express express-handlebars mongoose app-root-path multer cors
npm install --save-dev nodemon morgan node-sass prettier lint-staged husky

## chỉnh sửa file index.js



const express = require('express')
const morgan = require('morgan')
const path = require('path')
var appRoot = require('app-root-path').path;
const {engine} = require('express-handlebars')
const app = express()
const port = 3000

console.log(app);

app.engine('hbs',engine({extname: 'hbs'}) )

app.use(morgan('combined'))
app.use(express.static(path.join(appRoot,'src/public/')))
app.use(express.urlencoded({
extended: true
})) 

app.set('view engine', 'hbs');
app.set('views', path.join(appRoot,"src",'resource','views'));

app.get('/', (req, res) => {
res.render('home');  => dẫ vào thư mục 
});

app.listen(port, () => {
console.log(`Example app listening on port ${port}`)
})

## cấu hình lại package.json

"scripts": {
"start" :"nodemon --inspect ./src/index.js localhost 3000",
"watch" : "node-sass --watch src/resource/scss/ -o src/public/css/",
"test": "echo \"Error: no test specified\" && exit 1"
},

## cấu trúc lại file:

src
├── index.js
      └──resource
            └──views
                   ├── home.hbs
                   └── layouts
                      └── main.hbs
                   └──partials
                      └──header.hbs
                      └──footer.hbs
            └──scss
                  └──file.scss
      └──public
            └──img
            └──css
      └──routes
      └──app
        └──controllers
        └──models
      └──config
          └──db : index.js
      └──util
          └──mongose.js:
              module.exports = {
              multipleMongooseToObject: (mongooseArray) =>
                mongooseArray.map((mongoose) => mongoose.toObject()),
              MongooseToObject: (mongoose) => (mongoose ? mongoose.toObject() : mongoose), // sửa cái này lại tý vì đôi khi nó trả về mảng
            };


 ## sử dụng boostrap:
 như code thuần:

## chạy ứng dụng: 
npm run watch
npm start

# thiết lập mô hình mvc: 
# routes: 
 ## cấu hình index.js:
const siteRoute = require('./site')
function route(app) {
    app.use('/',siteRoute);
}
module.exports = route
 
 ## cấu hình site.js:
 const express = require('express')
const router = express.Router() 

const siteController = require('../app/controllers/SiteController')

router.get('/', siteController.index)


module.exports = router

# controllers
## cấu hình SiteController.js

class SiteController {
    //[GET] /
    index(req,res,next) {
        res.render('home')
    }
}

module.exports = new SiteController

# kết nối db:
## config/db/index.js:
### cấu hình kết nối với mongodb trên máy
const mongoose = require('mongoose');

async function connect() {
    try {
        await mongoose.connect('mongodb://localhost:27017/f8_eduction_dev');
        console.log('connect successfully');
    }
    catch (error) {
        console.log('connect failure');

    }
}

module.exports = {connect}

### kết nối với mongodb atlas:

const mongoose = require("mongoose");
const URL = "mongodb+srv://chuyendev:Lechuyen1998@shopdb.w7mfaei.mongodb.net/?retryWrites=true&w=majority";

async function connect() {
  try {
    await mongoose.connect(URL,{ useNewUrlParser: true, useUnifiedTopology: true});
    console.log("connect successfully");
  } catch (error) {
    console.log("connect failure");
    console.log(error);
    process.exit(1);
  }
}

module.exports = { connect };

### sử dụng:
ra src/index gọi :

const db = require('./config/db')

//Connect db

db.connect()

# tạo models làm việc với mongodb:

## cài đặt thư viện tự tăng id : npm i mongoose-sequence
### Autoincrement _id field: custom id: sử dụng phương pháp tăng id theo id cuối + 1 sẽ xảy ra lỗi trùng id nếu có nhiều người dùng cùng nhập 1 lúc=> sử dụng thư viện : mongodb sequence github
=> thư viện hỗ trợ việc tạo ra các trường tự tăng  \
cài đặt npm i mongoose-sequence
thêm vào models :
const AutoIncrement = require('mongoose-sequence')(mongoose);
  Course.plugin(AutoIncrement); để thế này nó tự hiểu là trường _id
  trường khác : Course.plugin(AutoIncrement, {inc_field: 'id'});
  const Course = new Schema(
  {
    _id: {type:Number},
    name: { type: String,required:true},
    description: { type: String},
    image : {type: String},
    slug: { type: String, slug: "name",unique: true },
    videoId : {type: String,required:true},
    level: {type: String}
  },
  {
    _id:false,//=> để nó không khởi tạo trường _id tự dộng
    timestamps:true //=> thêm vào ngày tạo ngày sửa
  }
  );

## xử lý lại cấu trúc Data: thêm thư viện slug, tùy chỉnh date data: npm install mongoose-slug-generator
 const slug = require('mongoose-slug-generator')
mongoose.plugin(slug)

slug: { type: String, slug: "name",unique: true },
## xử lý xóa mềm soft delete: npm install mongoose-delete
var mongooseDelete = require('mongoose-delete');
 Course.plugin(mongooseDelete, { deletedAt : true });
 Course.plugin(mongooseDelete,{ overrideMethods: 'all' ,deletedAt : true}); => ghi đè các thao tác với xóa mềm(find,findOne,...)=> đọc doc
## models/Course.js:

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const AutoIncrement = require('mongoose-sequence')(mongoose);
const slug = require('mongoose-slug-generator')
mongoose.plugin(slug)

const Video = new Schema({
    _id: {type:Number},
    channelId:{type:Number},
    name: { type: String,required:true},
    slug: { type: String, slug: "name",unique: true },
    description: { type: String, maxLenght: 600 },
    view:{type:Number},
    like:{type:Number},
    dislike:{type:Number},
    videoId : {type: String,required:true},
    image : {type: String,slug:'videoId'}
},{
    _id:false,
    timestamps:true
});

Video.plugin(AutoIncrement);
 Video.plugin(mongooseDelete, { deletedAt : true });
 Course.plugin(mongooseDelete,{ overrideMethods: 'all' ,deletedAt : true});

module.exports = mongoose.model('Course', Course);

# dùng model chọc vào db :

trong siteController.js
    1. import Course vào : const Course = require('../models/Course') => cái này chính là chọc vào form
    2. giả sử tại home muốn nó tương tác db(lấy dữ liệu về) :  
    index(req, res) {
        Course.find({}, function (err, courses) { ///=> find({} => lấy tất,callback => hàm xử lý dwux liệu trả về)
            if(!err) {
                res.json(courses)
            }
            else {
                res.status(400).json({error: 'Error'})
            }
          });
        // res.render('home');
    }
npm start thì trang chủ sẽ trả về dữ liệu như api

# xử lý upload file

## xử lý validation file :
const imageFilter = function(req, file, cb) {
    // Accept images only
    if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/)) {
        req.fileValidationError = 'Only image files are allowed!';
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};
exports.imageFilter = imageFilter;
## xử lý tên và vị trí file :
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'uploads/'); => chọn nơi lưu
    },

    // By default, multer removes file extensions so let's add them back
    filename: function(req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));=> tên file sẽ được định nghĩa ở đây
    }
});

## xử lý xuất file rea backend
"http://localhost:4000/img/" +tên file


# sử dụng file .env để cấu hình nơi lưu file:


## preview img trước khi upload:
ví dụ như thế này:
 <form runat="server">
  <input accept="image/*" type='file' id="imgInp" />
  <img id="blah" src="#" alt="your image" />
</form>


imgInp.onchange = evt => {
  const [file] = imgInp.files
  if (file) {
    blah.src = URL.createObjectURL(file)
  }
}

## sử dụng như một middleware:
const storage = require('../app/middleware/category')
const filter = require('../app/helpers/validationImg')

const upload = multer({storage: storage, fileFilter: filter})
route.post('/add',upload.single('icon'), categoryController.createCategory) => .singer('input-name') => up1 file từ input name='input-name'

# tạo trình soạn thảo văn bản:
cài đặt: npm install froala-editor
sử dụng: 
thêm css vào main.hbs: 
<link href="https://cdn.jsdelivr.net/npm/froala-editor@latest/css/froala_editor.pkgd.min.css" rel="stylesheet" type="text/css" />

tại file sử dụng :

<textarea></textarea>

<!-- Include Editor JS files. -->
<script type="text/javascript" src="https://cdn.jsdelivr.net/npm/froala-editor@latest/js/froala_editor.pkgd.min.js"></script>

<!-- Initialize the editor. -->
<script>
  new FroalaEditor('textarea');
</script>

là ok 


# xóa mềm: mongoose-delete
cài đặt: npm install mongoose-delete
sử dụng :
+ tại models:
 var mongooseDelete = require('mongoose-delete');

 Course.plugin(mongooseDelete,{ overrideMethods: 'all' ,deletedAt : true});

# CRUD với mongoDB
## Create : 
const formData = req.body
        formData.image= `https://i.ytimg.com/vi/${req.body.videoId}/hqdefault.jpg`;
        const course = new Course(formData) =>tạo thêm course trong db
        course.save() => có hai phương thức là call back và promise
            .then(() => res.redirect('../')) => chuyển trang khi save thành công
            .catch(error => { 
                
            })


 # [CRUD] Update course : xử lý put qua form(form chỉ hỗ trợ post và get)
 cài thư viện : npm install method-override   => mục đích là thêm method mà form không hỗ trợ thôi
 tại index : var methodOverride = require('method-override')
            app.use(methodOverride('_method'))
tại action form : thêm ?_method=PUT sau link 
 bây giờ thì có put rồi
 sử dụng phương thức put thôi
 để update tại controller : Course.updateOne({_id: req.params.id }(điều kiện tìm kiếm), req.body(dữ liệu đưa vào))   
                .then(() => res.redirect('/me/stored/courses'))=> chuyển hướng

# cho phép kết nối be và fe :
sử dụng cors express
 cài đặt : npm install cors
 sử dụng:  đặt mấy cái này tại vị trí muốn sử dụng
  var cors = require('cors')
nói chung là dùng như middleware bình thường thôi cors đã gọi ở trên là 1 func

app.use(cors()) => thay thế hoàn hảo đống code ở cách 1


thêm middleware này vào api của mình: 
function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next()
  }

# Swagger UI Express : middleWare cung cấp các tài liệu API được tạo tự động tạo swagger-ui từ express, dựa trên tệp swagger.json

cài đặt: npm i swagger-ui-express
sử dụng : 
## tạo src/config/swaggerApi/swagger.json:
https://editor.swagger.io/?_ga=2.61085358.38994026.1664927729-1441287652.1663210016

lên đây chọn file >Convert and save as JSON
rồi tải về mà custom lại, chơ thần thánh mô mà làm từ đầu

## trong file sử dụng(có thể là index.js or routes.js):
const swaggerUi = require("swagger-ui-express");
// const swaggerJsdoc = require('swagger-jsdoc')
const swaggerDocument = require('../config/swaggerApi/swagger.json');
const options = {

};

function route(app) {

  app.use("/api",swaggerUi.serve, swaggerUi.setup(swaggerDocumento,ptions), apiRoute);
}

module.exports = route;

# thêm:
## cài dặt sử dụng file .env để phát triển trên nhiều môi trường
cài đặt : npm i dotenv
sử dụng :
 require('dotenv').config() => gọi cái này và ko đặt biến gì cả

 process.env.(mấy cái tên mình định nghĩa)

 .env :
 PORT=4000
NODE_ENV=development
URL_REACT=http://localhost:3000/
URL_NODE_DEV=http://localhost:4000/
URL_NODE_PUBLIC=
EMAIL_APP_PASSWORD=
EMAIL_APP=


## xử lý xóa hình ảnh

const fs = require("fs");

fs.unlink("./src/public/img/" + path + fileName, function (err, data) {
      if (err) throw err;
      console.log("Delete file successfully");
    });


để function này ở đâu cũng kèm ./src/public/img/ cái này

## nhận req.body từ reactjs
app.use(express.json())


## cách không update toàn bộ dữ liệu mà chỉ up 1 trường của db: 
Customer.updateOne({ _id: req.params.customer_id },
      {
        $set: {
          active: true,
        },
      })
        .then(() => res.redirect('back'))
        .catch(err => console.log(err))


## jwt : phương thức trao đổi client và server => sử dụng xác thực người dùng
cài đặt jwt,cài tiếp cookie-parse: npm i --save-exact jsonwebtoken@8.5.1 cookie-parser@1.4.6

sử dụng thuật toán Algorithm: 

### sử dụng: 
folder middleware : 
jwtHandle.js: 

require('dotenv').config()
const jwt = require('jsonwebtoken')

const createJWT = () => {
        let payload = { email: '16520129chuyen@gmail.com',password : 'Abc@123' }
        let key = process.env.JWT_SECRET
        let token = jwt.sign(payload, key);
        console.log(token);
        return token
}

module.exports = {
        createJWT
}


## validation dữ liệu bằng yup
cài đặt : npm i yup
sử dụng const yup = require('yup')
dọc doc đi:

ví dụ
cấu hình
 const schema = yup.object({
  body : yup.object({
    name: yup.number()
  })
})

dùng

sử dụng như là 1 middleware thôi:
schema.val

## gửi mail bằng node js:
 cài đặt: npm i nodemailer
 cấu hình gamil để sử dụng: tìm từ khóa: google set up app password
 cài đặt bảo mật 2 lớp xong tạo một app password(trêng mạng chỉ rõ rồi)=>
 tùy chọn Mail và Window Computer

 

 sử dụng: 
const nodemailer = require("nodemailer");





var transporter =  nodemailer.createTransport({ // config mail server
    service: 'Gmail',
    auth: {
        user: 'chuyendev@gmail.com',
        pass: 'Lechuyen1998'
    }
});

const OrderConfirm = () => {
    
    var mainOptions = { // thiết lập đối tượng, nội dung gửi mail
        from: 'Chuyendev Shop',
        to: 'tomail@gmail.com',
        subject: 'Chuyendev-Xác nhận đơn hàng',
        text: '',
        html: '<p>Đơn hàng của bạn đã được đặt thành công </p>'
    }   
    
    transporter.sendMail(mainOptions, function(err, info){
        if (err) {
            console.log(err);
        } else {
            console.log('Message sent: ' +  info.response);
        }
    });
}


module.exports = {OrderConfirm}

## sử dụng redis hạn chế số lần request của client
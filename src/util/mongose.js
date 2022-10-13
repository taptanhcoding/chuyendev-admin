module.exports = {
  multipleMongooseToObject: (mongooseArray) =>
    mongooseArray.map((mongoose) => mongoose.toObject()),
  MongooseToObject: (mongoose) => (mongoose ? mongoose.toObject() : mongoose), // sửa cái này lại tý vì đôi khi nó trả về mảng
};

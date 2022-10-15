module.exports = {
  multipleMongooseToObject: (mongooseArray) =>
    mongooseArray.map((mongoose) => mongoose.toObject()),
  MongooseToObject: (mongoose) => {
    if(Array.isArray(mongoose)) {
      let {a} = (a ? a.toObject() : a)
      return 
    }else {
      return mongoose ? mongoose.toObject() : mongoose
    }
    
  },
};

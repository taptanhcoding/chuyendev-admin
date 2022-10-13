const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const AutoIncrement = require('mongoose-sequence')(mongoose);
var mongooseDelete = require('mongoose-delete');
const slug = require('mongoose-slug-generator')
mongoose.plugin(slug)

const Product = new Schema({
    id: {type: Number,unique:true},
    name: { type: String,required:true},
    description: { type: String, maxLenght: 600 },
    info: { type: String, maxLenght: 1600 },
    slug: { type: String, slug: "name",unique: true },
    categories:{type:String,require:true},
    price:{type:Number,require:true},
    new_price:{type:Number},
    image : {type: Array},
    color : {type: Array},
    amount: {type: Number,require:true}
},{
    timestamps:true
});

Product.plugin(AutoIncrement, {inc_field: 'id'});
Product.plugin(mongooseDelete,{ overrideMethods: 'all' ,deletedAt : true});

module.exports = mongoose.model('Product', Product);


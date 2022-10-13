const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const AutoIncrement = require('mongoose-sequence')(mongoose);
var mongooseDelete = require('mongoose-delete');
const slug = require('mongoose-slug-generator')
mongoose.plugin(slug)

const Cart = new Schema({
    order_id: {type: Number},
    customer_id: {type: Number},
    name: {type: String,require: true},
    address: {type: String,require: true},
    email: {type: String},
    phone: {type: String,require: true},
    detailOrder: {type: Array,require: true},
    totalPay:{type:String}
},{
    timestamps:true
});

Cart.plugin(AutoIncrement, {inc_field: 'order_id'});
Cart.plugin(mongooseDelete,{ overrideMethods: 'all' ,deletedAt : true});

module.exports = mongoose.model('Cart', Cart);


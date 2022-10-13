const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const AutoIncrement = require('mongoose-sequence')(mongoose);
var mongooseDelete = require('mongoose-delete');
const slug = require('mongoose-slug-generator')
mongoose.plugin(slug)

const Orders = new Schema({
    id_cart: {type: Number},
    user_id: { type: Number,required:true},
    carts: { type: Array},
},{
    timestamps:true
});

Orders.plugin(AutoIncrement, {inc_field: 'id_cart'});
Orders.plugin(mongooseDelete,{ overrideMethods: 'all' ,deletedAt : true});

module.exports = mongoose.model('Orders', Orders);


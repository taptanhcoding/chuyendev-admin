const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);
const Schema = mongoose.Schema;
var mongooseDelete = require('mongoose-delete');

const Customer = new Schema({
    _id: {type: Number},
    email: { type: String,required:true},
    password: { type: String,required:true},
    name: { type: String,default: ''},
    address: { type: String,default: ''},
    phone: { type: String,maxLength: 12,default:''},
    active:{type: Boolean,default:false}
},{
    _id:false,
    timestamps:true
});

Customer.plugin(AutoIncrement);

Customer.plugin(mongooseDelete,{ overrideMethods: 'all' ,deletedAt : true});

module.exports = mongoose.model('Customer', Customer);


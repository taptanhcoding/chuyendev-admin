const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var mongooseDelete = require('mongoose-delete');
const slug = require('mongoose-slug-generator')
mongoose.plugin(slug)

const Category = new Schema({
    name: { type: String,required:true},
    icon: { type: String,require:true},
    slug: { type: String, slug: "name",unique: true },
},{
    timestamps:true
});

Category.plugin(mongooseDelete,{ overrideMethods: 'all' ,deletedAt : true});

module.exports = mongoose.model('Category', Category);


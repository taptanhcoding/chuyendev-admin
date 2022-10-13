const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var mongooseDelete = require('mongoose-delete');
const slug = require('mongoose-slug-generator')
mongoose.plugin(slug)

const Band = new Schema({
    name: { type: String,required:true},
    avatar: {type: String},
    slug: { type: String, slug: "name",unique: true },
},{
    timestamps:true
});

Band.plugin(mongooseDelete,{ overrideMethods: 'all' ,deletedAt : true});

module.exports = mongoose.model('Band', Band);


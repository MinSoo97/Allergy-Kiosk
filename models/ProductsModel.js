var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var autoIncrement = require('mongoose-auto-increment');

// 생성될 필드명
var ProductsSchema = new Schema({
    name : String,
    price : Number,
    description : String,
    created_at : {
        type : Date,
        default : Date.now()
    }
});

ProductsSchema.plugin( autoIncrement.plugin, {model : 'products', field : 'id', startAt : 1});
module.exports = mongoose.model('products', ProductsSchema);
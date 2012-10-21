var mongoose = require("mongoose");

var sellingSchema = new mongoose.Schema({
	stock: {type: String, index: {unique: true}},
	seller: {type: String, index: {unique: true}},
	quantity: Number,
	cost: Number
});

//export the db model
module.exports = function(db) {
	return db.model('Selling', sellingSchema);
}
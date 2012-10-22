var mongoose = require("mongoose");

var sellingSchema = new mongoose.Schema({
	stock: String,
	seller: String,
	quantity: Number,
	cost: Number
});

//export the db model
module.exports = function(db) {
	return db.model('Selling', sellingSchema);
}
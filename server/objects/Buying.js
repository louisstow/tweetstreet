var mongoose = require("mongoose");

var buyingSchema = new mongoose.Schema({
	stock: String,
	buyer: String,
	quantity: Number,
	cost: Number
});

//export the db model
module.exports = function(db) {
	return db.model('Buying', buyingSchema);
}
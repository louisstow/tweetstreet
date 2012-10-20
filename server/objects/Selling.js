var mongoose = require("mongoose");
var ObjectId = mongoose.Schema.Types.ObjectId;

var sellingSchema = new mongoose.Schema({
	stock: ObjectId,
	quantity: Number,
	cost: Number,
	buyer: ObjectId,
	seller: ObjectId
});

//export the db model
module.exports = function(db) {
	return db.model('Selling', sellingSchema);
}
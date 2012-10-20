var mongoose = require("mongoose");
var ObjectId = mongoose.Schema.Types.ObjectId;

var buyingSchema = new mongoose.Schema({
	stock: ObjectId,
	quantity: Number,
	cost: Number,
	buyer: ObjectId,
	seller: ObjectId
});

//export the db model
exports = function(db) {
	return db.model('Buying', buyingSchema);
}
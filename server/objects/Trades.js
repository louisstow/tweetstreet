var mongoose = require("mongoose");
var ObjectId = mongoose.Schema.Types.ObjectId;

var tradeSchema = new mongoose.Schema({
	stock: String,
	buyer: String,
	seller: String,

	quantity: Number,
	cost: Number,
	date: Date	
});

//export the db model
module.exports = function(db) {
	return db.model('Trade', tradeSchema);
}
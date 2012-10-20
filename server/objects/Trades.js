var mongoose = require("mongoose");
var ObjectId = mongoose.Schema.Types.ObjectId;

var tradeSchema = new mongoose.Schema({
	stock: ObjectId,
	quantity: Number,
	cost: Number,
	buyer: ObjectId,
	seller: ObjectId
}, {_id: false});

//export the db model
exports = function(db) {
	return db.model('Trade', tradeSchema);
}
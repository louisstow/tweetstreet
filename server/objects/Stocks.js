var mongoose = require("mongoose");

var stockSchema = new mongoose.Schema({
	_id: {type: String, index: {unique: true}},
	tweets: Number,
	followers: Number,
	following: Number,
	price: Number,
	image: String
}, {_id: false});

//virtual name
stockSchema.virtual('stock').get(function () {
	return this._id;
});

//export the db model
module.exports = function(db) {
	return db.model('Stock', stockSchema);
}
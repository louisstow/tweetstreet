var mongoose = require("mongoose");

var stockSchema = new mongoose.Schema({
	screenname: String,
	tweets: Number,
	followers: Number,
	following: Number,
	price: Number
});

//export the db model
module.exports = function(db) {
	return db.model('Stock', stockSchema);
}
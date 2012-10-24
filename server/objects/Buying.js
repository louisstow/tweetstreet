//export the db model
module.exports = function(db) {
	
	var Buying = db.define("buying", {
		"tradeID": Number,
		"stockID": String,
		"buyerID": Number,
		"quantity": Number,
		"cost": Number,
		"created": Date
	});

	Buying.sync();

	return Buying;
}
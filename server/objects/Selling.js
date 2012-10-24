//export the db model
module.exports = function(db) {
	
	var Selling = db.define("selling", {
		"tradeID": Number,
		"stockID": String,
		"sellerID": Number,
		"quantity": Number,
		"cost": Number,
		"created": Date
	});

	Selling.sync();

	return Selling;
}
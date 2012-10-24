//export the db model
module.exports = function(db) {
	
	var Trades = db.define("history", {
		"historyID": Number,
		"stockID": String,
		"buyerID": Number,
		"sellerID": Number,
		"quantity": Number,
		"cost": Number,
		"created": Date
	});

	Trades.sync();

	return Trades;
}
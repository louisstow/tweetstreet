//export the db model
module.exports = function(db) {
	
	var Portfolio = db.define("portfolio", {
		"portfolioID": Number,
		"stockID": String,
		"userID": Number,
		"quantity": Number,
		"cost": Number,
		"created": Date
	});

	Portfolio.sync();

	return Portfolio;
}
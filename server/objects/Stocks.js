//export the db model
module.exports = function(db) {
	
	var Stock = db.define("stocks", {
		"stockID": String,
		"tweets": Number,
		"followers": Number,
		"following": Number,
		"cost": Number,
		"dayCost": Number,
		"image": String
	});

	Stock.sync();

	return Stock;
}
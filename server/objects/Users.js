//export the db model
module.exports = function(db) {
	
	var User = db.define("users", {
		"userID": Number,
		"userName": String,
		"email": String,
		"pass": String,
		"money": Number,
		"created": Date
	});

	User.sync();

	return User;
}
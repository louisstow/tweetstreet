var mongoose = require("mongoose");

var userSchema = new mongoose.Schema({
    name: String,
    email: String,
    pass: String
});

//export the db model
module.exports = function(db) {
	return db.model('User', userSchema);
}
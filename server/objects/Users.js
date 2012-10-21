var mongoose = require("mongoose");

var userSchema = new mongoose.Schema({
    _id: {type: String, index: {unique: true}},
    email: String,
    pass: String,
    money: Number
}, {_id: false});

//virtual name
userSchema.virtual('name').get(function () {
	return this._id;
});

//export the db model
module.exports = function(db) {
	return db.model('User', userSchema);
}
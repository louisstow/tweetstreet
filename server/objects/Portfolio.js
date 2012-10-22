var mongoose = require("mongoose");

var portfolioSchema = new mongoose.Schema({
    stock: String,
    user: String,
    quantity: Number, 
    paid: Number, 
    date: Date
});

//export the db model
module.exports = function(db) {
	return db.model('Portfolio', portfolioSchema);
}
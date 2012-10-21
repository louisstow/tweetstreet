exports.load = function (app, db) {

var Stock = require('../objects/Stocks')(db);
var Buying = require('../objects/Buying')(db);
var Selling = require('../objects/Selling')(db);

function trade () {

}

exports.buy = function(stock, user, quantity, cost) {
	var buy = new Buying({
		stock: stock,
		buyer: user,
		quantity: quantity,
		cost: cost
	});

	buy.save();
};

exports.sell = function(stock, user, quantity, cost) {
	var sell = new Selling({
		stock: stock,
		buyer: user,
		quantity: quantity,
		cost: cost
	});

	sell.save();
};

return exports;

};
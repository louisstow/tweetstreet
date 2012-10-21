exports.load = function (app, db) {

var Stock = require('../objects/Stocks')(db);
var Buying = require('../objects/Buying')(db);
var Selling = require('../objects/Selling')(db);
var Trades = require('../objects/Trades')(db);
var Users = require('../objects/Users')(db);
var ff = require("ff");

//trade types
var BUYING  = 0;
var SELLING = 0;

function cleanup () {
	Selling.remove({quantity: 0});
	Buying.remove({quantity: 0});
}

exports.buy = function(stock, user, quantity, cost) {
	
	var currentQuantity = quantity;
	var totalPrice = 0;

	ff(function () {
		Users.findOne({_id: user}, this.slot());
	}, function (userData) {
		if (userData.money < cost * quantity) {
			this.fail({error: "Not enough money"});
			return;
		}

		var buy = new Buying({
			stock: stock,
			buyer: user,
			quantity: quantity,
			cost: cost
		});
		buy.save(this.slot());

		//find any units selling for less than or equal to
		//our price
		Selling.find({
			_id: stock, 
			price: {$lte: cost},
			quantity: {$gt: 0}
		}, this.slot());
	}, function (buy, data) {
		//if no stocks found in our price range
		if (!data.length) {
			this.fail({error: "No stocks found"});
			return;
		}

		var unit;
		//loop over all available stocks
		for(var i = 0; i < data.length; ++i) {
			unit = data[i];

			//if enough quantity
			if (unit.quantity >= currentQuantity) {
				//remove bids from market
				Buying.remove({_id: buy._id});
				Selling.update({_id: unit._id, quantity: unit.quantity - currentQuantity});

				var trade = new Trades({
					stock: stock,
					buyer: user,
					seller: unit.seller,
					quantity: quantity,
					cost: unit.price
				});

				total += unit.price * quantity;
				trade.save();
				return false;
			//if more than 0, take all of it
			} else if(unit.quantity > 0) {
				//amount left to buy
				currentQuantity -= unit.quantity;

				Buying.update({_id: buy.id, quantity: currentQuantity});
				Selling.remove({_id: unit._id});
				
				//new trade
				var trade = new Trades({
					stock: stock,
					buyer: user,
					seller: unit.seller,
					quantity: unit.quantity,
					cost: unit.price
				});

				total += unit.price * unit.quantity;

				trade.save();
			}
		}

		Users.update({_id: user}, {"$dec": {money: total}});
		cleanup();
	}).error(function(e) {
		console.error(e);
		throw e;
	});
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

/**
* End point to put in a bid
*/
app.post("/api/trading/buy/", function (req, res) {
	if (!req.session.user) {
		return res.json({error: "Please login"});
	}

	try {
		exports.buy(
			req.body.stock,
			req.session.user,
			req.body.quantity,
			req.body.cost
		);
	} catch(e) {
		res.json(e);
	}
});

return exports;

};
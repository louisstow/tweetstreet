exports.load = function (app, db) {

var Stock = require('../objects/Stocks')(db);
var Buying = require('../objects/Buying')(db);
var Selling = require('../objects/Selling')(db);
var Trades = require('../objects/Trades')(db);
var Users = require('../objects/Users')(db);
var Portfolio = require('../objects/Portfolio')(db);
var ff = require("ff");

//trade types
var BUYING  = 0;
var SELLING = 0;

function cleanup () {
	Selling.remove({quantity: 0});
	Buying.remove({quantity: 0});
}

exports.buy = function(stock, user, quantity, cost, cb) {
	
	var currentQuantity = quantity;
	var total = 0;

	ff(function () {
		console.log("26")
		Users.findOne({_id: user}, this.slot());
	}, function (userData) {
		console.log("29")
		if (userData.money < cost * quantity) {
			this.fail({error: "Not enough money"});
			return;
		}
		console.log("34")

		var buy = new Buying({
			stock: stock,
			buyer: user,
			quantity: quantity,
			cost: cost
		});
		buy.save(this.slot());
		console.log("43")
		//find any units selling for less than or equal to
		//our price
		Selling.find({
			stock: stock, 
			cost: {$lte: cost},
			quantity: {$gt: 0}
		}, this.slot());
	}, function (buy, data) {
		//if no stocks found in our price range
		console.log("53", data.length)
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
				console.log("ENOUGH quantity", unit.quantity - currentQuantity, unit.id, unit._id);
				buy.remove();
				unit.quantity = unit.quantity - currentQuantity;
				unit.save(function(err) {
					console.log("UPDATE YOU PRICK", arguments);
				});
				
				//update the trading price
				Stock.update({_id: stock}, {
					price: unit.cost,
					priceDiff: unit.cost - unit.dayPrice
				}, function(){});

				//save it in the portfolio
				Portfolio.create({
					stock: stock,
					user: user,
					quantity: quantity, 
					paid: unit.cost, 
					date: Date.now()
				}, function(){});

				//log the trade
				var trade = new Trades({
					stock: stock,
					buyer: user,
					seller: unit.seller,
					quantity: quantity,
					cost: unit.cost,
					date: Date.now()
				});

				total += unit.cost * quantity;
				trade.save();
				break;
			//if more than 0, take all of it
			} else if(unit.quantity > 0) {
				//amount left to buy
				currentQuantity -= unit.quantity;

				buy.quantity = currentQuantity;
				buy.save();
				Selling.remove({_id: unit._id});

				Stock.update({_id: stock}, {
					price: unit.cost,
					priceDiff: unit.cost - unit.dayPrice
				});
				
				Portfolio.create({
					stock: stock,
					user: user,
					quantity: unit.quantity, 
					paid: unit.cost, 
					date: Date.now()
				});
				
				//new trade
				var trade = new Trades({
					stock: stock,
					buyer: user,
					seller: unit.seller,
					quantity: unit.quantity,
					cost: unit.cost,
					date: Date.now()
				});

				total += unit.cost * unit.quantity;

				trade.save();
			}
		}

		Users.update({_id: user}, {"$inc": {money: -total}}, function() {
			console.log("\nLOSE MONEY", arguments);
		});
		cleanup();
	}).cb(cb);
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

	if (!req.body.stock || !req.body.quantity || !req.body.cost) {
		return res.json({error: "Incorrect arguments"});
	}

	exports.buy(
		req.body.stock,
		req.session.user,
		+req.body.quantity || 0,
		+req.body.cost || 0,
		function (err) {
			console.log("\n\n\n\nBUY", arguments);
			if (err) res.json({error: err})
			else res.send(200);
		}
	);


});

return exports;

};
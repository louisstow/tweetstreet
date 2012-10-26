var ff = require("ff");

exports.load = function (opts) {

var app = opts.app;
var conn = opts.conn;

//trade types
var BUYING  = 0;
var SELLING = 0;

function cleanup () {
	conn.query("DELETE FROM selling WHERE quantity = 0");
	conn.query("DELETE FROM buying WHERE quantity = 0");
}

exports.buy = function(stock, user, quantity, cost, cb) {
	
	var currentQuantity = quantity;
	var total = 0;

	ff(function () {
		
		conn.query("SELECT * FROM users WHERE ? LIMIT 1", {
			userID: user
		}, this.slot());
	}, function (userData) {
		userData = userData[0];
		if (userData.money < cost * quantity) {
			this.fail({error: "Not enough money"});
			return;
		}

		//insert into buying
		conn.query("INSERT INTO buying VALUES (DEFAULT, ?)", [[
			stock,
			user,
			quantity,
			cost.toFixed(5),
			new Date
		]], this.slot());

		//find any units selling for less than or equal to
		//our price
		conn.query("SELECT * FROM selling WHERE stockID=? AND cost <= ? AND quantity > 0", [
				stock,
				cost
		], this.slot());
		
	}, function (buy, data) {
		//if no stocks found in our price range
		if (!data.length) {
			this.fail({error: "No stocks found"});
			return;
		}

		var unit;
		//loop over all available stocks
		for (var i = 0; i < data.length; ++i) {
			unit = data[i];

			//if enough quantity
			if (unit.quantity >= currentQuantity) {
				
				console.log("ENOUGH quantity", unit.quantity - currentQuantity);

				//remove bids from market
				conn.query("DELETE FROM buying WHERE ? LIMIT 1", {tradeID: buy.insertId});

				//remove the quantity
				conn.query("UPDATE selling SET quantity = quantity - ? WHERE ?", [
					currentQuantity,
					{tradeID: unit.tradeID}
				]);

				//give the user their hard earned money
				//give the user their hard earned money
				conn.query("UPDATE users SET money = money + ? WHERE ?", [
					quantity * unit.cost,
					{userID: unit.sellerID}
				]);
				
				//update sale price
				conn.query("UPDATE stocks SET ? WHERE ?", [
					{cost: unit.cost},
					{stockID: stock}
				]);

				conn.query("INSERT INTO portfolio VALUES (DEFAULT, ?)", [[
					stock,
					user,
					quantity,
					unit.cost,
					new Date
				]]);

				conn.query("INSERT INTO history VALUES (DEFAULT, ?)", [[
					stock,
					user,
					unit.sellerID,
					quantity,
					unit.cost,
					new Date
				]]);

				total += unit.cost * quantity;
				
				break;
			//if more than 0, take all of it
			} else if(unit.quantity > 0) {
				//amount left to buy
				currentQuantity -= unit.quantity;

				conn.query("UPDATE buying SET ? WHERE ?", [
					{quantity: currentQuantity},
					{tradeID: buy.insertId}
				]);

				conn.query("DELETE FROM selling WHERE ? LIMIT 1", {
					tradeID: unit.tradeID
				});

				conn.query("UPDATE stocks SET ? WHERE ?", [
					{cost: unit.cost},
					{stockID: stock}
				]);

				//give the user their hard earned money
				conn.query("UPDATE users SET money = money + ? WHERE ?", [
					unit.quantity * unit.cost,
					{userID: unit.sellerID}
				]);

				conn.query("INSERT INTO portfolio VALUES (DEFAULT, ?)", [[
					stock,
					user,
					quantity,
					unit.cost,
					new Date
				]]);

				conn.query("INSERT INTO history VALUES (DEFAULT, ?)", [[
					stock,
					user,
					unit.sellerID,
					quantity,
					unit.cost,
					new Date
				]]);

				total += unit.cost * unit.quantity;
			}
		}

		conn.query("UPDATE users SET money = money - ? WHERE ?", [
			total,
			{userID: user}
		]);

		cleanup();
	}).cb(cb);
};

exports.sell = function(portfolioID, user, quantity, cost, cb) {
	ff(function () {
		//grab the info about their portfolio
		conn.query("SELECT * FROM portfolio WHERE ? AND ?", [
			{portfolioID: portfolioID},
			{userID: user}
		], this.slot());
	}, function (portfolio) {
		portfolio = portfolio[0];
		if (portfolio.quantity < quantity) {
			this.fail({error: "Not enough stock"});
		}

		//add to the market
		conn.query("INSERT INTO selling VALUES (DEFAULT, ?)", [[
			portfolio.stockID,
			user,
			quantity,
			cost,
			new Date
		]]);


	}, function (account) {


	}).error(function (e) {
		console.log("ERROR INSELL", e);
		cb && cb(1, e);
	});
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
		req.session.userID,
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
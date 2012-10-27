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
		//make sure we have enough money
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
		
	}, function (buy, asks) {
		//if no stocks found in our price range
		if (!data.length) {
			this.fail({error: "No stocks found"});
			return;
		}

		var ask;
		var currentQuantity = quantity; //the quantity we still need
		var i = 0;
		var total = 0;
		var lastPrice = 0;

		while (currentQuantity > 0) {
			ask = asks[i++];

			//value to decrement from
			var takeAway = Math.min(currentQuantity, ask.quantity);

			//decrement the quantity from bid
			conn.query("UPDATE selling SET quantity = quantity - ? WHERE ?", [
				takeAway,
				{tradeID: ask.tradeID}
			]);

			total += ask.cost * takeAway;
			
			//update sale price
			lastPrice = ask.cost;

			//add it to their portfolio
			conn.query("INSERT INTO portfolio VALUES (DEFAULT, ?)", [[
				stockID,
				user,
				takeAway,
				ask.cost,
				new Date
			]]);

			//save the trade history
			conn.query("INSERT INTO history VALUES (DEFAULT, ?)", [[
				stockID,
				user,
				ask.sellerID,
				quantity,
				ask.cost,
				new Date
			]]);

			//give them their hard earned money
			conn.query("UPDATE users SET money = money + ? WHERE ?", [
				takeAway * ask.cost,
				{userID: ask.userID}
			]);

			currentQuantity -= takeAway;
		}

		//save the last price
		conn.query("UPDATE stocks SET ? WHERE ?", [
			{cost: lastPrice},
			{stockID: stockID}
		]);

		//update selling
		conn.query("UPDATE buying SET quantity = ? WHERE ?", [
			Math.max(currentQuantity, 0),
			{tradeID: buy.insertId}
		]);

		cleanup();
	}).cb(cb || function() {});
};

/**
* Selling stock
* 1. Check the user has the amount of stock in portfolio
* 2. Insert the stockID, quantity, cost into [selling]. Take out from portfolio
* 3. Check if any bids [buying] with quantity > 0 and cost <= sellingCost
* 4. If bid.quantity >= my.quantity
	a. Take our quantity delete the ask
	b. Take money from buyer
	c. Credit us
	d. Update the bid
* 5. otherwise
	a. Take the whole pie and delete the ask
	b. update our selling quantity
	c. Take money from buyer
	d. Credit us
* 6.
*/
exports.sell = function (portfolioID, user, quantity, cost, cb) {
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

		this.pass(portfolio);

		//add to the market
		conn.query("INSERT INTO selling VALUES (DEFAULT, ?)", [[
			portfolio.stockID,
			user,
			quantity,
			cost,
			new Date
		]], this.slot());

		//select all bids within range
		conn.query("SELECT * FROM buying WHERE quantity > 0 AND cost >= ?", 
			cost,
			this.slot();
		);

		//update our portfolio quantity
		conn.query("UPDATE portfolio SET quantity = quantity - ? WHERE ?", [
			quantity,
			{portfolioID: portfolioID}
		]);
	}, function (portfolio, selling, bids) {

		var bid;
		var currentQuantity = quantity; //the quantity we still need
		var stockID = portfolio.stockID;
		var i = 0;
		var total = 0;
		var lastPrice = 0;

		while (currentQuantity > 0) {
			bid = bids[i++];

			//value to decrement from
			var takeAway = Math.min(currentQuantity, bid.quantity);

			//decrement the quantity from bid
			conn.query("UPDATE buying SET quantity = quantity - ? WHERE ?", [
				takeAway,
				{tradeID: bid.tradeID}
			]);

			total += bid.cost * takeAway;
			
			//update sale price
			lastPrice = bid.cost;

			//add it to their portfolio
			conn.query("INSERT INTO portfolio VALUES (DEFAULT, ?)", [[
				stockID,
				bid.userID,
				takeAway,
				bid.cost,
				new Date
			]]);

			//save the trade history
			conn.query("INSERT INTO history VALUES (DEFAULT, ?)", [[
				stockID,
				bid.buyerID,
				user,
				quantity,
				bid.cost,
				new Date
			]]);

			currentQuantity -= takeAway;
		}

		//give us our hard earned money
		conn.query("UPDATE users SET money = money + ? WHERE ?", [
			takeAway * unit.cost,
			{userID: user}
		]);

		//save the last price
		conn.query("UPDATE stocks SET ? WHERE ?", [
			{cost: lastPrice},
			{stockID: stockID}
		]);

		//update selling
		conn.query("UPDATE selling SET quantity = ? WHERE ?", [
			Math.max(currentQuantity, 0),
			{tradeID: selling.insertId}
		]);

		cleanup();
	}).error(function (e) {
		console.log("ERROR INSELL", e);
		cb && cb(1, e);
	}).cb(cb || function() {});
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
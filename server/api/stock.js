var ff = require("ff");
var twitter = require("../twitter");
var MAX_RECORDS = 50;

exports.load = function (opts) {

var app = opts.app;
var conn = opts.conn;

/**
* Create a Stock
*/
exports.create = function(opts, cb) {
	ff(function () {
		twitter.getAccount(opts.twitter, this.slotPlain());
	}, function (account) {

		if (!account) {
			cb && cb(null);
			return;
		}

		//calculate the IPO of the account
		var IPO = (account.followers_count / account.friends_count) * 
				  (account.followers_count / account.statuses_count) * 
				   account.followers_count;

		//create the data to save
		var data = {
			stockID: opts.twitter,
			tweets: account.statuses_count,
			followers: account.followers_count,
			following: account.friends_count,
			cost: IPO.toFixed(3),
			dayCost: 0,
			image: account.profile_image_url
		};

		//grab the values
		var values = [];
		for (var key in data) 
			if (data.hasOwnProperty(key)) values.push(data[key]);

		//upsert stock
		var q = conn.query("INSERT INTO stocks VALUES (?)", [values], function (err, result) {
			console.log("\n\n\nCREATE", arguments, values);
			if (err) return;

			conn.query("INSERT INTO selling VALUES (DEFAULT, ?)", [[
				opts.twitter,
				1, //PLEASE MAKE SURE TWEETSTREET = 1
				100000,
				IPO.toFixed(3),
				new Date
			]]);
		});
		console.log("SQL", q.sql)

		data._id = opts.twitter;
		cb && cb(data);
	});
}

exports.get = function(id, cb) {
	ff(function() {
		twitter.getAccount(id, this.slotPlain());
		
		conn.query("SELECT * FROM stocks WHERE ? LIMIT 1", {
			stockID: id
		}, this.slot());
	}, function(account, result) {
		if (!result.length) {
			console.log("No stock found in database", account, result, id);
			cb && cb(null);
			return;
		}

		result = result[0];
		var data = {};

		//no twitter data, use what we have
		if (!account || JSON.stringify(account) === "{}") {
			
			data.cost = result.cost;
			data.dayCost = result.dayCost;
			data.stockID = result.stockID;
			data.status = "I don't talk much";
			data.description = "?";
			data.tweets = result.tweets;
			data.followers = result.followers;
			data.following = result.following;
			data.image = result.image;

			return cb && cb(data);
		}

		data = {
			tweets: account.statuses_count,
			followers: account.followers_count,
			following: account.friends_count,
			image: account.profile_image_url
		};

		//update the database with the new data
		conn.query("UPDATE stocks SET ? WHERE ?", [
			data,
			{stockID: id}
		]);
		
		//copy data from various sources
		data.cost = result.cost;
  		data.dayCost = result.dayCost;
  		data.stockID = result.stockID;
		data.status = (account.status && account.status.text) || "I don't talk much";
		data.description = account.description;

		cb && cb(data);
	}).error(function(e) {
		console.log("\n\n\nERROR IN GET", arguments);
		cb && cb(null);
	});
}

exports.portfolio = function (id, cb) {
	var q = conn.query("SELECT p.*, DATE_FORMAT(created, '%e %b %l:%i%p') as created, s.image, FORMAT(p.cost * p.quantity, 2) as total, FORMAT(s.cost * p.quantity - p.cost * p.quantity, 2) as difference, FORMAT(p.cost, 2) as cost, FORMAT(s.cost, 2) as currentPrice \
				FROM portfolio p INNER JOIN stocks s ON p.stockID = s.stockID WHERE ?", {
		userID: id
	}, cb);
	console.log(q.sql);
}

exports.getBuying = function (id, cb) {
	conn.query("SELECT *, DATE_FORMAT(created, '%e %b %l:%i%p') as created, FORMAT(cost * quantity, 2) as total, FORMAT(cost, 2) as cost\
		FROM buying WHERE ?", 
		{buyerID: id}, 
		cb
	);
}

exports.getSelling = function (id, cb) {
	conn.query("SELECT *, DATE_FORMAT(created, '%e %b %l:%i%p') as created, FORMAT(cost * quantity, 2) as total, FORMAT(cost, 2) as cost\
		FROM selling WHERE ?", 
		{sellerID: id}, 
		cb
	);
}

/**
* Get my stock
*/
app.get("/api/stock/", function (req, res) {
	if (!req.session.userID) {
		res.json({error: "User not found"});
		return;
	}

	exports.portfolio(req.session.userID, function (err, data) {
		res.json(data)
	});
});

/**
* Create a new stock via an api
*/
app.post("/api/stock/", function (req, res) {
	var body = req.body;

	exports.create({twitter: req.body.twitter});
});

/**
* Get a stock via api
*/
app.get("/api/stock/:id", function (req, res) {
	exports.get(req.params.id, function (stock) {
		console.log("GET STOCK", stock);
		if (stock) {
			res.json(stock);	
		} else {
			exports.create({twitter: req.params.id}, function(stock) {
				res.json(stock);
			});
		}
	});
});

app.get("/api/stock/top/:limit", function (req, res) {
	var limit = Math.min(MAX_RECORDS, req.params.limit || 10);
	conn.query("SELECT * FROM stocks ORDER BY cost desc LIMIT ?", limit, function (err, result) {
		res.json(result);
	});
});

app.get("/api/stock/trending/:limit", function (req, res) {
	var limit = Math.min(MAX_RECORDS, req.params.limit || 10);
	conn.query("SELECT * FROM stocks ORDER BY (cost - dayCost) desc LIMIT ?", limit, function (err, result) {
		res.json(result);
	});
});

return exports;

};

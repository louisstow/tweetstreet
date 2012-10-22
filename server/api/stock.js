var ff = require("ff");
var twitter = require("../twitter");
var MAX_RECORDS = 50;

exports.load = function (app, db) {

var Stock = require('../objects/Stocks')(db);
var Selling = require('../objects/Selling')(db);
var Users = require('../objects/Users')(db);
var Portfolio = require('../objects/Portfolio')(db);

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
			tweets: account.statuses_count,
			followers: account.followers_count,
			following: account.friends_count,
			price: IPO,
			dayPrice: 0,
			priceDiff: IPO,
			image: account.profile_image_url,
			_id: opts.twitter
		};

		//upsert stock
		Stock.create(data, function (err, num, r) {
			console.log("\n\n\nCREATE", arguments)
			//insert the new selling stocks
			Selling.create({
				stock: opts.twitter,
				quantity: 100000,
				cost: IPO,
				seller: "TweetStreet"
			}, function() {
				console.log("\n\n\n\nSELLING", arguments)
			});
		});

		data._id = opts.twitter;
		cb && cb(data);
	});
}

exports.get = function(id, cb) {
	ff(function() {
		twitter.getAccount(id, this.slotPlain());
		Stock.findOne({_id: id}, this.slot());
	}, function(account, result) {
		if (!account || !result) {
			console.log("NULL", account, result, arguments);
			cb && cb(null);
			return;
		}

		var data = {
			tweets: account.statuses_count,
			followers: account.followers_count,
			following: account.friends_count,
			image: account.profile_image_url
		};

		Stock.update({_id: result._id}, data);
		
		//copy data from various sources
		data.price = result.price;
  		data.dayPrice = result.dayPrice;
 		data.priceDiff = result.priceDiff;
  		data._id = result._id;
		data.status = account.status.text;
		data.description = account.description;

		console.log(data);

		cb && cb(data);
	});
}

/**
* Get my stock
*/
app.get("/api/stock", function (req, res) {
	if (!req.session.user) {
		res.json({error: "User not found"});
		return;
	}

	Portfolio.find({user: req.session.user}, function (err, resp) {
		if (err) {
			res.json({error: "User not found", code: err});
		} else res.json(resp);
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
	Stock.find().sort("-price").limit(limit).exec(function (err, data) {
		console.log("SORTED", data);
		res.json(data);
	});
});

app.get("/api/stock/trending/:limit", function (req, res) {
	var limit = Math.min(MAX_RECORDS, req.params.limit || 10);
	Stock.find().sort("-priceDiff").limit(limit).exec(function (err, data) {
		console.log("SORTED", data);
		res.json(data);
	});
});

return exports;

};
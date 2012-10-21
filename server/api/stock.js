var ff = require("ff");
var twitter = require("../twitter");
var MAX_RECORDS = 50;

exports.load = function (app, db) {

var Stock = require('../objects/Stocks')(db);
var Selling = require('../objects/Selling')(db);

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
			image: account.profile_image_url
		};

		//upsert stock
		Stock.update({_id: opts.twitter}, data, {upsert: true}, function (err, num, r) {
			
			//insert the new selling stocks
			Selling.update({_id: opts.twitter}, {
				quantity: 100000,
				cost: IPO,
				seller: "TweetStreet"
			}, {upsert: true, safe: true});
		});

		data._id = opts.twitter;
		cb && cb(data);
	});
}

exports.get = function(id, cb) {
	Stock.find({_id: id}, cb);
}

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
	exports.get(req.params.id, function (err, stock) {
		console.log("GET STOCK", stock);
		if (stock.length) {
			res.json(stock[0]);	
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

return exports;

};
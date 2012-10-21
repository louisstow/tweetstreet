var ff = require("ff");

exports.load = function (app, db) {
//start load

var User = require("../objects/Users")(db);
var Stock = require("../objects/Stocks")(db);
var Selling = require("../objects/Selling")(db);
var twitter = require("../twitter");

var stock = require("./stock").load(app, db);

/**
* Register user
*/
app.post("/api/user/", function (req, res, err) {
	console.log("POST USER", req.body);
	var body = req.body;

	ff(function () {
		User.find(
			//check user or email 
			{$or: [{name: body.name} , {email: body.email}]},
			this.slot()
		);
	}, function (exists) {
		if (exists.length) {
			this.fail({error: "Username or email address taken", code: 50});
			return;
		}
		
		//create a user object
		var user = new User({
			_id: body.name,
			pass: body.pass,
			email: body.email,
			money: 10000
		});

		user.save();

		//create the stock from the twitter handle
		stock.create({twitter: body.twitter});

		res.send(200);
	}).error(function (e) {
		console.log(e);
		res.json(e);
	});
});

/**
* List all users
*/
app.get("/api/user/", function (req, res) {
	//grab all users
	User.find({}, function (err, result) {
		console.log("GET USERS", result);
		res.json(result);	
	});
});

/**
* Login system
*/
app.post("/api/user/login/", function (req, res) {
	var user = req.body.user;
	var pass = req.body.pass;

	User.findOne({_id: user, pass: pass}, function (err, result) {
		if (result) {
			req.session.user = user;
			res.send(200);
		} else {
			console.log("NO USER", result, user, pass);
			res.json({error: "No user found"});
		}
	});
});

//end load
};
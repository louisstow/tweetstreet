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

	if (!body.name || body.name.trim().length === 0) {
		console.log(body.name);
		return res.json({error: "Please enter username"});
	}

	if (!body.pass || body.pass.length === 0) {
		return res.json({error: "Please enter password"});	
	}

	//no spaces in username
	body.name = body.name.trim();

	ff(function () {
		User.find(
			//check user or email 
			{$or: [{_id: body.name}, {email: body.email}]},
			this.slot()
		);
	}, function (exists) {
		if (exists.length) {
			this.fail({error: "Username or email address taken", code: 50});
			return;
		}
		console.log(exists);
		
		//create a user object
		var user = new User({
			_id: body.name,
			pass: body.pass,
			email: body.email,
			money: 10000
		});

		user.save();

		//create the stock from the twitter handle
		if (body.twitter && body.twitter.length)
			stock.create({twitter: body.twitter});

		req.session.user = body.name;
		res.json({
			user: body.name,
			money: 10000,
			email: body.email
		});
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

			res.json({
				user: user,
				money: result.money,
				email: result.email
			});
		} else {
			console.log("NO USER", result, user, pass);
			res.json({error: "No user found"});
		}
	});
});

/**
* Logout
*/
app.get("api/user/logout/", function (req, res) {
	req.session = null;
	res.send(200);
});

/**
* Make sure the user is logged in
*/
app.get("/api/user/logged/", function (req, res) {
	console.log("GOT THE REQUEST", req.session, req.session.user)
	if (req.session.user) {
		console.log("IS LOGGED", req.session.user);
		User.findOne({_id: req.session.user}, function (err, resp) {
			res.json({
				user: req.session.user,
				money: resp.money,
				email: resp.email
			});
		})
	} else {
		console.log("IS NOT LOGGED");
		res.json({error: "Not logged in"});
	}
});

//end load
};
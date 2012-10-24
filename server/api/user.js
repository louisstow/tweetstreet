var ff = require("ff");
var twitter = require("../twitter");

exports.load = function (opts) {
//start load
var app = opts.app;
var conn = opts.conn;

var stock = require("./stock").load(opts);

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
		//check existing user
		conn.query("SELECT userID FROM users WHERE ? OR ?", {
			userName: body.name,
			email: body.email
		}, this.slotPlain());
	}, function (exists) {
		if (exists.length) {
			this.fail({error: "Username or email address taken", code: 50});
			return;
		}
		console.log(exists);
		
		//create a user object
		conn.query("INSERT INTO users VALUES (DEFAULT, ?)", [[
			body.name,
			body.email,
			body.pass,
			1000000, //a million cents = 10k
			new Date
		]]);

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
* Login system
*/
app.post("/api/user/login/", function (req, res) {
	var user = req.body.user;
	var pass = req.body.pass;

	conn.query("SELECT userID, money, email FROM users WHERE ? AND ? LIMIT 1", {
		userName: user,
		pass: pass
	}, function (err, result) {
		console.log("POST LOGIN", err, result);

		if (result.length) {
			result = result[0];
			req.session.user = user;
			req.session.userID = result.userID

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

		conn.query("SELECT * FROM users WHERE ? LIMIT 1", {
			userName: req.session.user
		}, function (err, result) {
			console.log("GET LOGGED", err, result);
			if (!result.length) res.send(500);
			result = result[0];

			res.json({
				user: req.session.user,
				money: result.money,
				email: result.email
			});
		});
	} else {
		console.log("IS NOT LOGGED");
		res.json({error: "Not logged in"});
	}
});

//end load
};
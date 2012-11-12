var ff = require("ff");
var twitter = require("../twitter");
var crypto = require("crypto");
var SALT = "money";

exports.load = function (opts) {
//start load
var app = opts.app;
var conn = opts.conn;

var stock = require("./stock").load(opts);

exports.getTop = function (next) {
	conn.query("SELECT userName, FORMAT(money, 2) as money FROM users WHERE userID > 1 ORDER BY money desc LIMIT 10", next);
};

exports.getWorst = function (next) {
	conn.query("SELECT userName, FORMAT(money, 2) as money FROM users WHERE userID > 1 ORDER BY money asc LIMIT 10 ", next);
};

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

	var hash = crypto.createHash("sha1");
	hash.update(SALT + body.pass);
	var encryptedPass = hash.digest("base64"); 

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
			encryptedPass,
			10000, //a million cents = 10k
			new Date
		]], this.slot());
	}, function (user) {

		//create the stock from the twitter handle
		if (body.twitter && body.twitter.length)
			stock.create({twitter: body.twitter});

		req.session.user = body.name;
		req.session.userID = user.insertId;
		req.session.money = 10000;

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
	var hash = crypto.createHash("sha1");
	hash.update(SALT + pass);
	var encryptedPass = hash.digest("base64");

	conn.query("SELECT userID, money, email FROM users WHERE ? AND ? LIMIT 1", [
		{userName: user},
		{pass: encryptedPass}
	], function (err, result) {
		console.log("POST LOGIN", err, result);

		if (result.length) {
			result = result[0];
			req.session.user = user;
			req.session.userID = result.userID;
			req.session.money = result.money;

			res.json({
				user: user,
				money: result.money,
				email: result.email
			});
		} else {
			console.log("NO USER", result, user, encryptedPass);
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

//end load
return exports;
};
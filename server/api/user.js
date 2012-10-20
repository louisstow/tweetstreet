exports.load = function (app, db) {
//start load

var User = require("../objects/Users")(db);
var twitter = require("../twitter");

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
			console.log("User exists", exists)
			res.json({error: "Username or email address taken", code: 50});
			return;
		}

		twitter.getAccount(body.twitter, this.slot());
	}, function (account) {

		//create a user object
		var user = new User({
			name: body.name,
			pass: body.pass,
			email: body.email
		});

		user.save();
		res.send(200);
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

//end load
};
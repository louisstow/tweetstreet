var express = require("express");
var fs = require("fs");
var path = require("path");
var mysql = require("mysql");
var app = express();


/**
* Initialise Express
*/
app.use(express.cookieParser('mysecrettweet'));
app.use(express.session({secret: "mysecrettweet", cookie: {maxAge: null}}));

app.use(express.static("./src/public", { maxAge: 1 }));
app.use(express.bodyParser());

app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.set('view options', {layout: false});

app.listen(5657);

/**
* Initialise MySQL
*/
var connString = "mysql://root@localhost/tweetdb";
var connection = mysql.createConnection(connString);

//for each api, require it and pass in the objects
var apis = ["stock", "user", "trading", "history"];
var q = {};
apis.forEach(function (api, i) {
	//import api and run the load function
	q[api] = require("./api/" + api).load({
		app: 		app,
		conn: 		connection
	});
});

function showPage(page, opts) {
	var values = {};

	for (var key in opts) {
		values[key] = opts[key];
	}

	values.logged = !!opts.req.session.userID;
	values.user = opts.req.session;

	delete values.req;
	delete values.res;

	opts.res.render(page, values);
}


/**
* Setup pages
*/ 
app.get("/", function (req, res) {
	showPage('home', {
		req: req, 
		res: res, 
		title: 'TweetStreet - Stock Exchange for Twitter'
	});
});

app.get("/login", function (req, res) {
	showPage('login', {
		req: req, 
		res: res, 
		title: 'Login to TweetStreet - Stock Exchange for Twitter'
	});
});

app.get("/register", function (req, res) {
	showPage('register', {
		req: req, 
		res: res, 
		title: 'Register to TweetStreet - Stock Exchange for Twitter'
	});
});

app.get("/stock/:id", function (req, res) {
	q.stock.get(req.params.id, function (data) {
		if (!data) {
			
			q.stock.create({twitter: req.params.id}, function(data) {
				data.req = req;
				data.res = res;
				data.title = data.stockID + ' @ TweetStreet - Stock Exchange for Twitter';
				showPage('stock', data);
			});
		} else {
			data.req = req;
			data.res = res;
			data.title = data.stockID + ' @ TweetStreet - Stock Exchange for Twitter';

			showPage('stock', data);
		}
	});
});

app.get("/my-portfolio", function (req, res) {
	if (!req.session.user) return res.redirect("/login");

	q.stock.portfolio(req.session.userID, function (err, result) {
		if (err) return res.redirect("/login");

		var data = {
			req: req,
			res: res,
			title: 'My Portfolio'
		};

		console.log("\n\nWATA", result, err)

		data.portfolio = result;
		showPage('portfolio', data);
	});
});
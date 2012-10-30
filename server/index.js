var express = require("express");
var fs = require("fs");
var ff = require("ff");
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

var title = "Tweet Street - Stock Exchange for Twitter";

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
		title: title
	});
});

app.get("/login", function (req, res) {
	showPage('login', {
		req: req, 
		res: res, 
		title: 'Login to ' + title
	});
});

app.get("/register", function (req, res) {
	showPage('register', {
		req: req, 
		res: res, 
		title: 'Register to ' + title
	});
});

app.get("/stock/:id", function (req, res) {
	q.stock.get(req.params.id, function (data) {
		if (!data) {
			
			q.stock.create({twitter: req.params.id}, function(data) {
				data.req = req;
				data.res = res;
				data.title = data.stockID + ' @ ' + title;
				showPage('stock', data);
			});
		} else {
			data.req = req;
			data.res = res;
			data.title = data.stockID + ' @ ' + title;

			showPage('stock', data);
		}
	});
});

app.get("/my-portfolio", function (req, res) {
	if (!req.session.user) return res.redirect("/login");

	var data = {
		req: req,
		res: res,
		title: 'My Portfolio'
	};

	ff(function () {
		q.stock.portfolio(req.session.userID, this.slot());
	}, function (portfolio) {
		data.portfolio = portfolio;
		q.stock.getBuying(req.session.userID, this.slot());	
	}, function (buying) {
		data.buying = buying;
		q.stock.getSelling(req.session.userID, this.slot());	
	}, function (selling) {
		data.selling = selling;

		showPage('portfolio', data);
	}).error(function (e) {
		console.log("GET PORTFOLIO", e);
		res.send(500);
	});
});
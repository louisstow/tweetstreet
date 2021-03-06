var express = require("express");
var fs = require("fs");
var ff = require("ff");
var path = require("path");
var mysql = require("mysql");
var app = express();

global.cache = {};

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

app.listen(3000);

var title = "Tweet Street - Stock Exchange for Twitter";

/**
* Initialise MySQL
*/
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'tweet on the street',
  database : 'tweetdb'
});

connection.connect(function (err) {
	console.log("ERR", err);
});

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

	ff(function () {
		var slut = this.slot();

		//only check their money if logged in
		if (values.logged) {
			connection.query("SELECT FORMAT(money, 2) as money FROM users WHERE ?", {
				userID: values.user.userID
			}, slut);
		} else {
			slut();
		} 
	}, function (result) {
		if (result && result.length) {
			opts.req.session.money = +result[0].money.replace(/,/g, "") || 0;
			values.money = result[0].money;
		}
		
		opts.res.render(page, values);
	});
	
}


/**
* Setup pages
*/ 
app.get("/test", function (req, res) {
	console.log("TEST");
	res.send(404);
});

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
	if (!req.params.id) return res.send(404);

	if (req.params.id.charAt(0) === '@')
		req.params.id = req.params.id.substr(1);

	q.stock.get(req.params.id, function (data) {
		if (!data) {
			
			q.stock.create({twitter: req.params.id}, function(data) {
				data = data || {};
				data.req = req;
				data.res = res;

				if (data.stockID) {
					data.title = data.stockID + ' @ ' + title;
					showPage('stock', data);
				} else {
					data.title = "Stock not found " + title;
					showPage('404', data);
				}
			});
		} else {
			data.req = req;
			data.res = res;
			data.title = data.stockID + ' @ ' + title;

			showPage('stock', data);
		}
	});
});

app.get("/instructions", function (req, res) {
	showPage('instructions', {
		req: req, 
		res: res, 
		title: 'Instructions' + title
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

app.get("/top", function (req, res) {
	var data = {
		req: req,
		res: res,
		title: 'Top Traders @ ' + title
	};

	ff(function () {
		q.user.getTop(this.slot());
	}, function (top) {
		data.top = top;
		q.user.getWorst(this.slot());
	}, function (worst) {
		data.worst = worst;
		showPage('top', data);
	}).error(function (e) {
		console.log("GET TOP", e);
		res.send(500);
	});
});

app.get("/latest", function (req, res) {
	var data = {
		req: req,
		res: res,
		title: 'Latest Trades @ ' + title
	};

	ff(function () {
		q.history.getLatest(this.slot());
	}, function (latest) {
		data.latest = latest;
		showPage("latest", data);
	});
});

app.get("/about", function (req, res) {
	showPage("about", {
		req: req,
		res: res,
		title: 'About Tweet Street'
	});
});

//logout page
app.get("/logout", function (req, res) {
	if (req.session) {
		res.clearCookie('auth');
		req.session.destroy(function() {});
		req.session = null;
	}
	res.redirect("/");
});

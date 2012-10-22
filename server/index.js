var mongoose = require('mongoose');
var express = require("express");
var fs = require("fs");
var path = require("path");
var app = express();


/**
* Initialise Express
*/

app.use(express.cookieParser('mysecrettweet'));
app.use(express.session({secret: "mysecrettweet", cookie: {maxAge: null}}));

app.use(express.static("./src", { maxAge: 1 }));
app.use(express.bodyParser());

app.listen(5657);

/**
* Initialise Mongodb
*/
var db = mongoose.createConnection('localhost', 'tweetdb');

//log all errors
db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', function () {
	//return the db model
	console.log("DATABASE CONNECTED");
});

var User = require("./objects/Users")(db);

var bot = new User({
	_id: "TweetStreet",
	pass: "StreetTweet",
	money: 10000
});

bot.save();

/**
* Load each api
*/
["stock", "user", "trading", "history"].forEach(function (api, i) {
	//import api and run the load function
	require("./api/" + api).load(app, db);
});

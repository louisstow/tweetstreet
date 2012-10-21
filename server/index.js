var mongoose = require('mongoose');
var express = require("express");
var app = express();

/**
* Initialise Express
*/

app.use(express.cookieParser('mysecrettweet'));
app.use(express.cookieSession({secret: "mysecrettweet"}));
app.use(express.session());
app.use(express.static("./src"));
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

/**
* Load each api
*/
["stock", "user", "trading", "history"].forEach(function (api, i) {
	//import api and run the load function
	require("./api/" + api).load(app, db);
});

var mongoose = require('mongoose');
var express = require("express");
var ff = require("ff");
var app = express();

/**
* Initialise Express
*/
app.use(express.bodyParser());
app.use(express.static("./src"));

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
["stock", "user", "trading", "history"].forEach(function (i, api) {
	//import api and run the load function
	require("./api/" + api).load(app, db);
});

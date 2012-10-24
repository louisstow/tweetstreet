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

app.use(express.static("./src", { maxAge: 1 }));
app.use(express.bodyParser());

app.listen(5657);

/**
* Initialise MySQL
*/
var connString = "mysql://root@localhost/tweetdb";
var connection = mysql.createConnection(connString);

//for each api, require it and pass in the objects
var apis = ["stock", "user", /*"trading",*/ "history"];
apis.forEach(function (api, i) {
	//import api and run the load function
	require("./api/" + api).load({
		app: 		app,
		conn: 		connection
	});
});


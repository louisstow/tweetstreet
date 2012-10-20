var mongoose = require('mongoose');
var express = require("express");
var app = express();

//create the mongodb connection
var db = mongoose.createConnection('localhost', 'tweetdb');

//return the db model
var User = require("./objects/User")(db);

//log all errors
db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', function () {
  // yay!
  console.log("yay!");
});

app.post("/user/", function (req, res, err) {
	console.log("POST USER", req.body);
	res.send(200);
});

app.use(express.static("./src"));
app.listen(5657);
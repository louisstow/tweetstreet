var mysql = require("mysql");

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'tweet on the street',
  database : 'tweetdb'
});

connection.query("UPDATE stocks SET dayCost = cost", function () {
	process.exit(0);	
});

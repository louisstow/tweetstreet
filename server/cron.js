var mysql = require("mysql");

var connString = "mysql://root@localhost/tweetdb";
var conn = mysql.createConnection(connString);

conn.query("UPDATE stocks SET dayCost = cost", function () {
	process.exit(0);	
});

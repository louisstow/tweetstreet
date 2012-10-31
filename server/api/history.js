var ff = require("ff");

exports.load = function (opts) {

var app = opts.app;
var conn = opts.conn;

app.get("/api/history/:stockID", function (req, res) {
	ff(function () {
		conn.query("SELECT UNIX_TIMESTAMP(created) as created, cost FROM history WHERE ? ORDER BY created asc", {
			stockID: req.params.stockID
		}, this.slot());
	}, function (result) {
		var data = [];
		for (var i = 0; i < result.length; ++i) {
			data.push([+result[i].created * 1000, result[i].cost]);
		}

		res.json(data);
	});
});

};
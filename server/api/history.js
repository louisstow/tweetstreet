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

exports.getLatest = function (cb) {
	conn.query("SELECT h.*, s.image, DATE_FORMAT(h.created, '%e %b %l:%i%p') as created, FORMAT(h.cost, 2) as price, u1.userName as buyer, u2.userName as seller, FORMAT(h.cost * h.quantity, 2) as total \
				FROM history h INNER JOIN users u1 ON h.buyerID = u1.userID \
							   INNER JOIN users u2 ON h.sellerID = u2.userID \
							   INNER JOIN stocks s ON s.stockID = h.stockID \
				ORDER BY historyID desc LIMIT 50", cb)
}

return exports;

};
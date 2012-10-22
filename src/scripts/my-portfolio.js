
api({
	method: "GET",
	url: "stock/",
	success: function (resp) {
		console.log(resp)
		if (resp.length === 0) {
			$("#stocks").html("You do not have any shares")
			return;
		}

		parseContent(resp);
	}
});

function parseContent(data) {
	var item;
	var html =  "<table><tr><th>Date</th><th>Stock</th>";
		html += "<th>Unit Price</th><th>Quantity</th>";
		html += "<th>Total</th><th>Current Price</th><th>Sell</th></tr>";
	for(var i = 0; i < data.length; ++i) {
		item = data[i];
		html += [
			"<tr id='" + item.stock + "'>",
				"<td class='date'>",
					item.date,
				"</td><td>",
				"<a href='#stock/" + item.stock + "'>",
					"<img src='" + item.image + "' />",
					item.stock,
				"</a></td>",
				"<td class='paid'>",
					"$" + formatMoney(item.paid),
				"</td>",
				"<td class='quantity'>",
					item.quantity,
				"</td>",
				"<td class='total'>",
					"$" + formatMoney(item.paid * item.quantity),
				"</td>",
				"<td class='current'>",
					"$" + formatMoney(item.currentPrice),
				"</td>",
				"<td>",
					"<input type='number' class='quantity' />",
					"<input type='number' class='price' value='" + (+item.currentPrice).toFixed(2) + "' />",
					"<button>ask</button>",
				"</td>",
			"</tr>"
			//"<img src='" + item. + "'"
		].join("");
	}

	$("#stocks").html(html);
}
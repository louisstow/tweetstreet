
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
		html += "<th>Unit Price</th><th>Quantity</th><th>Total</th></tr>";
	for(var i = 0; i < data.length; ++i) {
		item = data[i];
		html += [
			"<tr>",
				"<td class='date'>",
				item.date,
				"</td><td>",
				"<a href='#stock/" + item.stock + "'>",
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
			"</tr>"
			//"<img src='" + item. + "'"
		].join("");
	}

	$("#stocks").html(html);
}
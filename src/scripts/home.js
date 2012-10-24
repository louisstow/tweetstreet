

/**
* Get the top 10 stocks
*/
api({
	url: "stock/top/10",
	method: "GET",
	success: function (resp) {
		//update the top 10 page
		var html = "";
		var stock;
		for(var i = 0; i < resp.length; ++i) {
			stock = resp[i];
			html += "<li>";
			html += "<a href='#stock/" + stock.stockID + "'>";
			html += "<img src='" + stock.image + "'> ";
			html += stock.stockID + "</a> ";
			html += "<span class='price'>$" + formatMoney(stock.cost) + "</span>";

			var diff = stock.cost - stock.dayCost;
			var arrow = diff < 0 ? "▼" : "▲";
			var color = diff < 0 ? "red" : "green";
			html += "<span class='diff " + color + "'>" + arrow + " $" + formatMoney(diff) + "</span>";
		}

		$("#top-10 ul").html(html);
	}
});

/**
* Get the trending stock
*/
api({
	url: "stock/trending/10",
	method: "GET",
	success: function (resp) {
		//update the top 10 page
		var html = "";
		var stock;
		for(var i = 0; i < resp.length; ++i) {
			stock = resp[i];
			html += "<li>";
			html += "<a href='#stock/" + stock.stockID + "'>"
			html += "<img src='" + stock.image + "'> ";
			html += stock.stockID + "</a> ";
			html += "<span class='price'>$" + formatMoney(stock.cost) + "</span>";

			var diff = stock.cost - stock.dayCost;
			var arrow = diff < 0 ? "▼" : "▲";
			var color = diff < 0 ? "red" : "green";
			html += "<span class='diff " + color + "'>" + arrow + " $" + formatMoney(diff) + "</span>";
		}

		$("#trending ul").html(html);
	}
});
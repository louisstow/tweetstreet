$(function() {
	/**
	* Get the top 10 stocks
	*/
	api({
		url: "stock/top/10",
		method: "GET",
		success: function (resp) {
			//update the top 10 page
			$("#top-10 ul").html(printStocks(resp));
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
			$("#trending ul").html(printStocks(resp));
		}
	});
});


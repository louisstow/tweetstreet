console.log(QUERY);

form['buy'] = {
	url: "trading/buy/",
	success: onBuy
};

api({
	url: "stock/" + QUERY[0],
	method: "GET",
	success: function (resp) {
		console.log(resp);
		$("#profile").attr("src", resp.image);
		$("#stock").text(resp.stockID);
		$("#price").text("$" + formatMoney(resp.cost));
		$("#tweets").text(resp.tweets);
		$("#followers").text(resp.followers);
		$("#following").text(resp.following);

		$("input.cost").val(resp.cost.toFixed(2));
		$("input.stock").val(resp.stockID);
	}
});

function onBuy () {
	console.log("BUY", arguments)
}
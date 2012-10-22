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
		$("#stock").text(resp._id);
		$("#price").text("$" + formatMoney(resp.price));
		$("#tweets").text(resp.tweets);
		$("#followers").text(resp.followers);
		$("#following").text(resp.following);

		$("input.cost").val(resp.price.toFixed(2));
		$("input.stock").val(resp._id);
	}
});

function onBuy () {
	console.log("BUY", arguments)
}
$(function() {
	//register click events for cancel buttons
	$("#buying button.cancel").click(function (e) {
		deleteTrade.call(this, e, "buying");
	});

	$("#selling button.cancel").click(function (e) {
		deleteTrade.call(this, e, "selling");
	});

	var buyingTotal = totalColumns("#buying");
	$("#buying table").append("<tr class='total'><td></td><td></td><td></td><td></td><td class='red'>-$"+formatMoney(buyingTotal)+"</td></tr>");

	var sellingTotal = totalColumns("#selling");
	$("#selling table").append("<tr class='total'><td></td><td></td><td></td><td></td><td class='green'>+$"+formatMoney(sellingTotal)+"</td></tr>");
	
	$("#portfolio td.diff").each(function () {
		$(this).addClass(
			$(this).text().charAt(1) === "-" ? "red" : "green"
		);
	})
});

function deleteTrade (e, type) {
	var id = $(this).attr("data-id");

	api({
		url: type + "/delete/",
		data: {id: id},
		success: function () {
			window.location.reload();
		}
	})
}

function totalColumns (selector) {
	var total = 0;
	$("tr", selector).each(function () {
		var cost = +$(this).find("td.cost").text().substr(1);
		var quantity = +$(this).find("td.quantity").text();
		
		total += cost * quantity;
	});

	return total;
}
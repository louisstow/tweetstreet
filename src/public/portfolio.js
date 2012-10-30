$(function() {
	//register click events for cancel buttons
	$("#buying button.cancel").click(function (e) {
		deleteTrade.call(this, e, "buying");
	});

	$("#selling button.cancel").click(function (e) {
		deleteTrade.call(this, e, "selling");
	});
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
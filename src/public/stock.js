var stockID;
$(function () {
	stockID = window.location.pathname.substr(
		window.location.pathname.lastIndexOf("/") + 1
	);

	console.log(user);

	api({
		url: "history/" + stockID,
		method: "GET",
		success: createChart
	});
	
	$("input.quantity, input.cost").change(function () {
		var price = $("input.quantity").val() * $("input.cost").val();
		$("#cost").text("-$" + formatMoney(price, 3));
	});
})

function createChart (data) {
	if (!data.length) {
		$("#graph").html("<strong>No trade history to plot</strong>");
		return;
	}
	
	//give the chart a go
	try {
		var chart = new Highcharts.StockChart({
			chart : {
				renderTo : 'graph'
			},

			exporting: {
				enabled: false
			},

			credits: {
	            enabled: false
	        },

			rangeSelector : {
				selected : 1
			},
			
			series : [{
				name : stockID,
				data : data,
				tooltip: {
					valueDecimals: 5
				}
			}]
		});
	} catch(e) {
		$("#graph").html("<strong>Error creating chart</strong>");
	}
}
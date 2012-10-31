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
	
})

function createChart (data) {
	console.log(data)
	if (!data.length) {
		$("#graph").html("<strong>No trade history to plot</strong>");
		return;
	}
	
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
}
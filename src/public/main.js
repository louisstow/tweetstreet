var FORM = {
	"login": {
		url: "user/login/",
		success: function (resp) {
			if (resp.error) {
				return $("#message").html(resp.error)
			}

			window.location = "/";
		}
	},

	"register": {
		url: "user/",
		success: function (resp) {
			if (resp.error) {
				return $("#message").html(resp.error)
			}

			window.location = "/";
		}
	},

	"buy": {
		url: "trading/buy/",
		success: function (resp) {
			if (resp.error) {
				return $("#message").html(resp.error);
			}

			window.location = "/my-portfolio";
		}
	},

	"sell": {
		url: "trading/sell/",
		success: function (resp) {
			if (resp.error) {
				return $("#message").html(resp.error);
			}

			//window.location.reload();
		}
	}
};

$(function () {
	api({
		url: "stock/top/10",
		method: "GET",
		success: function (resp) {
			//update the top 10 page
			$("#marquee ul").html(printStocks(resp));

			startMarquee();
		}
	});

	//for each form
	$(".form").each(function () {
		var $form = $(this);
		var type = $form.attr("id") || $form.attr("data-id");

		//no information about form
		if (!FORM[type]) return;

		//on the button click grab the form data
		$("button", $form).click(function () {
			var data = {};

			$("input", $form).each(function () {
				var key = $(this).attr("class");
				var val = $(this).val();

				data[key] = val;
			});

			api({
				url: FORM[type].url,
				data: data,
				success: FORM[type].success
			});
		});
	});

	$("#search button").click(function () {
		window.location = "/stock/" + $("#search input").val();
	});	
});

function startMarquee() {
	var contents = $("#marquee ul");
	var contents2 = contents.clone().appendTo("#marquee");
	var x = 0;
	var xspeed = 2;
	var width = contents.outerWidth();

	//slow down marquee on mouse over
	contents.mouseover(function () {
		xspeed = 0.5;
	}).mouseout(function () {
		xspeed = 2;
	})

	setInterval(function () {
		//tick should be outside of render
		x -= xspeed;
	}, 20);

	//shim out rAF
	var requestAnimFrame = (function() {
		return  window.requestAnimationFrame       || 
			window.webkitRequestAnimationFrame || 
			window.mozRequestAnimationFrame    || 
			window.oRequestAnimationFrame      || 
			window.msRequestAnimationFrame     || 
			function (callback){
				window.setTimeout(callback, 1000 / 60);
			};
	})();

	(function animloop(){
		requestAnimFrame(animloop);
		
		contents.css("left", x % width | 0);
		contents2.css("left", x % width + width | 0)
	})();
}

function printStocks (data) {
	var html = "";

	for(var i = 0; i < data.length; ++i) {
		stock = data[i];
		html += "<li>";
		html += "<a href='/stock/" + stock.stockID + "'>";
		html += "<img src='" + stock.image + "'> ";
		html += stock.stockID + "</a> ";
		html += "<span class='price'>$" + formatMoney(stock.cost) + "</span>";

		var diff = stock.cost - stock.dayCost;
		var arrow = diff < 0 ? "▼" : "▲";
		var color = diff < 0 ? "red" : "green";
		html += "<span class='diff " + color + "'>" + arrow + " $" + formatMoney(diff) + "</span>";
	}

	return html;
}

function api (opts) {
	//default error handler
	opts.error = opts.error || showError;

	var data = {
		type: opts.method || "POST",
		url: "/api/" + opts.url,
		data: JSON.stringify(opts.data),
		contentType: "application/json",
		dataType: "text",
		success: function (resp) {
			//transform OK into json
			if (resp === "OK")
				resp = "{\"status\": \"OK\"}";

			resp = JSON.parse(resp);
			opts.success && opts.success.apply(this, [resp]);
		},
		error: opts.error
	};

	if (opts.method === "GET") {
		delete data.data;
		delete data.contentType;
	}

	$.ajax(data);
}

function showError () {
	return console.error(arguments);
}

function formatMoney(n, d, t) {
	var c = 2, //if decimal is zero we must take it, it means user does not want to show any decimal
	d = d || '.'; //if no decimal separator is passed we use the dot as default decimal separator (we MUST use a decimal separator)

	t = t || ','; //if you don't want to use a thousands separator you can pass empty string as thousands_sep value

	sign = (n < 0) ? '-' : '',

	//extracting the absolute value of the integer part of the number and converting to string
	i = parseInt(n = Math.abs(n).toFixed(c)) + '', 

	j = ((j = i.length) > 3) ? j % 3 : 0; 
	return sign + (j ? i.substr(0, j) + t : '') + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : ''); 
}
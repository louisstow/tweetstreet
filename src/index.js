var form = {
	"login": {url: "user/login/", success: onLogin},
	"register": {url: "user/", success: onRegister},
};

//query object
var QUERY;
var ME;

$(function () {
	//parse main page first
	parseTemplates(document.body, function() {
		parseForms(document.body);
	});

	//open the main page
	if (window.location.hash) {
		openPage(window.location.hash.substr(1), function (args) {
			//error loading page
			if (args[1] === "error") {
				openPage("404", init);
			}

			init();
		});
	} else {
		//open the home page
		openPage("home", init);		
	}
});

function init () {
	api({
		url: "user/logged/",
		method: "GET",
		success: function (resp) {
			if (!resp.error) {
				postLogin(resp)
			}
		}
	});

	$("a").live("click", function (e) {
		var target = $(this).attr("href");
		if (target && target.charAt(0) === "#") {
			openPage(target.substr(1));
		}
		return true;
	});

	$("a.login").click(function() {
		$("#login").toggle();
	});

	$("a.register").click(function() {
		$("#register").toggle();
	});
}

function postLogin(user) {
	$("#register, #login, a.register, a.login").hide();
	$("#welcome").show()
	$("#welcome span").text([
		"On the floor,",
		user.user,
		"$" + formatMoney(user.money)
	].join(" "));

	ME = user;
}

function onLogin (resp) {
	if (resp.error) {
		showError(resp.error);
	} else {
		postLogin(resp);
	}
}

function onRegister (resp) {
	postLogin(resp)
}

function openPage (url, cb) {
	var $main = $("#main");

	if (url.indexOf('/') !== -1) {
		var splat = url.split("/");
		url = splat[0];
		QUERY = splat.slice(1);
	}

	$main.load("./templates/" + url + ".html", function () {
		var args = arguments;

		$.getScript("./scripts/" + url + ".js", function () {
			//parse the templates
			parseTemplates($main, function () {
				cb && cb.apply(null, args);

				//parse any forms
				parseForms($main);
			});
		});
	});
}

function api (opts) {
	//default error handler
	opts.error = opts.error || showError;

	var data = {
		type: opts.method || "POST",
		url: "/api/" + opts.url,
		data: JSON.stringify(opts.data),
		contentType: "application/json",
		dataType: "json",
		success: opts.success,
		error: opts.error
	};

	if (opts.method === "GET") {
		delete data.data;
		delete data.contentType;
	}

	$.ajax(data);
}

function callback (cb) {
	var group = 0;
	var argument = [];
	return function wait() {
		group++;
		return function handler() {
			group--;
			argument.push(arguments);
			if (group === 0) 
				cb && cb(argument);
		}
	}
}

function parseTemplates (parent, cb) {
	var wait = callback(cb);

	var search = $("section", parent);
	if (!search.length) return wait()();

	search.each(function () {
		var templ = $(this).attr("class");
		$(this).load("./templates/" + templ + ".html", wait());
	});
}

function parseForms (parent) {
	//docready
	$("div.form", parent).each(function () {
		var type = $(this).attr("id");
		var endpoint = form[type];
		var $form = $(this);
		
		//send form request
		$("button", $(this)).click(function () {
			var data = {};

			$form.find("input").each(function () {
				data[$(this).attr("class")] = $(this).val();
			});

			endpoint.data = data;
			api(endpoint);
		});
	});
}

function showError(err) {
	console.error(err);
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
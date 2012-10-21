$(function () {
	//open the main page
	if (window.location.hash) 
		openPage(window.location.hash.substr(1), function (args) {
			//error loading page
			if (args[0][1] === "error") {
				openPage("404");
			}
		});

	//parse main page
	parseTemplates(document.body, function() {
		parseForms(document.body);
	});

	init();
});

function init () {

}

function onLogin () {

}

function onRegister () {
	
}

function openPage (url, cb) {
	var wait = callback(cb);
	$("#main").load("./templates/" + url + ".html", wait());

	var script = wait();
	$.getScript("./scripts/" + url + ".js", script).fail(script);
}

function api (opts) {
	//default error handler
	opts.error = opts.error || showError;

	$.ajax({
		type: "POST",
		url: "/api/" + opts.url,
		data: opts.data,
		contentType: "json",
		dataType: "json",
		success: opts.success,
		error: opts.error
	});
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

	$("section", parent).each(function () {
		var templ = $(this).attr("class");
		$(this).load("./templates/" + templ + ".html", wait());
	});
}

function parseForms (parent) {
	var form = {
		"login": {url: "/user/login/", success: onLogin},
		"register": {url: "/user/", success: onRegister},
	};

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
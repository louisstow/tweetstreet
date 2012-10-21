$(function () {
	var form = {
		"login": {url: "/user/login/", success: onLogin},
		"register": {url: "/user/", success: onRegister},
	};

	//docready
	$("div.form").each(function () {
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
});

function onLogin () {

}

function api(opts) {
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
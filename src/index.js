$(function() {
	//docready
	$.ajax({
		type: "POST",
		url: "/api/user/",
		data: JSON.stringify({name: "test", pass: "test", email: "", twitter: "louisstow"}),
		
		contentType: "application/json",
		success: function() { console.log(arguments); },
		error: function() { console.error(arguments); }

	});
});
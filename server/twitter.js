var twitter = require("twitter");

var twit = new twitter({
	consumer_key: 'pZDMmoPAyM3KwLCZhP7w',
	consumer_secret: '2PzE3jpx8RWl2TRmDy4ki6E0jJBRBYhhmxDS3Q',
	access_token_key: '16663578-TgRnLYXapsJ3BlMDfoDMCB4tTgwKfvGqMl7QBIQiJ',
	access_token_secret: '1xIz7H4QUqhnWLsegsn9k1i1xsiIcVJQIGLqh5T8'
});

exports = {
	getAccount: function (name, cb) {
		twit.get('/users/show.json', {screen_name: name, include_entities: 'true'}, function(data) {
			cb(JSON.parse(data));
		});
	}
};
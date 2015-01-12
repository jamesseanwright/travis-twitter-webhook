'use strict';

var Twitter = require('twitter');
var sha256Helper = require('../encryption/sha256Helper');
var requiredProps = ['number', 'status_message', 'message', 'build_url', 'repository'];

var client = new Twitter({
	consumer_key: process.env.CONSUMER_KEY,
	consumer_secret: process.env.CONSUMER_SECRET,
	access_token_key: process.env.ACCESS_TOKEN_KEY,
	access_token_secret: process.env.ACCESS_TOKEN_SECRET
});

function isValid(payload) {
	var requiredProp;

	for (var i = 0; i < requiredProps.length; i++) {
		requiredProp = requiredProps[i];
		if (payload[requiredProp] === undefined) {
			return false;
		};
	}

	return true;
}

module.exports = function (req, res, next) {
	var actualHash = sha256Helper(req.get('Travis-Repo-Slug'), process.env.TRAVIS_TOKEN, 'hex');
	var payload;
	var tweet;

	if (req.get('Authorization') !== actualHash) {
		next(401);
		return;
	};
	
	payload = JSON.parse(req.body.payload);

	if (!isValid(payload)) {
		next(400);
		return;
	}

	tweet = 'Build ' + payload.number + ' of ' + payload.repository.name + ' has ' + payload.status_message.toLowerCase() + ': ' + payload.build_url;

	client.post('statuses/update', { status: tweet }, function (err) {
		if (err) {
			next(500);
			return;
		}

		res.json({ result: 'success' });
	});
};
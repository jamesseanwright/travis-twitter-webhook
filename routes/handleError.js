'use strict';

var messages = {
	401: 'Incorrect TRAVIS_TOKEN',
	400: 'Invalid payload',
	500: 'Twitter API error. Check your API keys and Twitter\'s availability'
};

module.exports = function (err, req, res, next) {
	res.status(err).json({ error: messages[err] });
	next();
};
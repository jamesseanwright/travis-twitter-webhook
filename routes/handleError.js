'use strict';

var messages = {
	401: 'Incorrect TRAVIS_TOKEN',
	400: 'Invalid payload',
	500: 'Twitter API error. Either the keys are incorrect ' +
			'or the statuses/update endpoint has detected a duplicate post'
};

module.exports = function (err, req, res, next) {
	res.status(err).json({ error: messages[err] });
	next();
};
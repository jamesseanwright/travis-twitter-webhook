'use strict';

var sha256Helper = require('../encryption/sha256Helper');
var requiredProps = ['number', 'status_message', 'commit_message', 'build_url', 'repository'];

function isValid(payload) {
	for (var requiredProp in requiredProps) {
		if (payload[requiredProp] === undefined) {
			return false
		};
	};

	return true;
}

module.exports = function (req, res, next) {
	var actualHash = sha256Helper(process.env.SALT, process.env.TRAVIS_TOKEN, 'hex');
	var payload = req.body.payload;

	if (req.get('Authorization') !== actualHash) {
		next(401);
		return;
	};

	if (!isValid(payload)) {
		next(400);
		return;
	}


};
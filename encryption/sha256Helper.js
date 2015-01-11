'use strict';

var crypto = require('crypto');

module.exports = function (salt, data, digest) {
	return crypto.createHash('sha256').update(salt + data).digest(digest);
};
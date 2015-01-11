var helper = require('../../encryption/sha256Helper');
var salt = 'jamesseanwright/jamesswright.co.uk';
var travisToken = 'TRAVIS_TOKEN';
var digest = 'hex';

describe('the SHA256 helper', function () {
	it('should correctly encode the input', function () {
		var expectedHash = 'd1a8b225de5468d44155839a0a39dc2e991888e57d30e3fca0390d84c666df51';
		var actualHash = helper(salt, travisToken, digest);
		actualHash.should.equal(expectedHash);
	})
});
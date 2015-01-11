var nock = require('nock');
var sendNotification = require('../../routes/sendNotification');

var receivedPayload = {
	number: "1",
	status_message: 'Passed',
	commit_message: 'Commit message',
	build_url: 'https://travis-ci.org/jamesseanwright/jamesswright.co.uk',
	repository: {
		name: 'jamesswright.co.uk'
	}
};

var fakeReq = {
	body: {
		payload: JSON.stringify({})
	},
	get: function (key) {} 
};

var fakeMiddleware = {
	next: function (err) {}
};

var fakeRes = {
	json: function (data) {}
};

var fakeTwitterClient = {
	post: function (endpoint, data, callback) {}
};

var mockNext;
var mockRes;
var mockTwitterPost;

describe('the sendNotification route', function () {
	it('should reject the request if the auth header is invalid', function () {
		sinon.stub(fakeReq, 'get').withArgs('Authorization').returns('wrong!');
		mockNext = sinon.mock(fakeMiddleware).expects('next').once().withArgs(401);
		process.env.SALT = 'salt';
		process.env.TRAVIS_TOKEN = 'actual token innit';

		sendNotification(fakeReq, null, fakeMiddleware.next);
		mockNext.verify();

		fakeReq.get.restore();
		fakeMiddleware.next.restore();
	});

	it('should reject the request if the payload is invalid', function () {
		sinon.stub(fakeReq, 'get').withArgs('Authorization').returns('f2c18165b659e387d0f2aaf9cd577f01dc8bd11d56aa7ffb022a69ad734e2aea');
		mockNext = sinon.mock(fakeMiddleware).expects('next').once().withArgs(400);
		process.env.SALT = 'salt';
		process.env.TRAVIS_TOKEN = 'actual token innit';

		sendNotification(fakeReq, null, fakeMiddleware.next);
		mockNext.verify();

		fakeReq.get.restore();
		fakeMiddleware.next.restore();
	});

	it('should tweet the notification if everything is valid', function () {
		var expectedTweet = 'Build ' + receivedPayload.number + ' of ' + receivedPayload.repository.name + ' has ' + receivedPayload.status_message.toLowerCase() + ': ' + receivedPayload.build_url;

		var updateEndpoint = nock('https://api.twitter.com:443')
							  .post('/1.1/statuses/update.json', "status=Build%201%20of%20jamesswright.co.uk%20has%20passed%3A%20https%3A%2F%2Ftravis-ci.org%2Fjamesseanwright%2Fjamesswright.co.uk")
							  .reply(200, doAssertions);

		sinon.stub(fakeReq, 'get').withArgs('Authorization').returns('f2c18165b659e387d0f2aaf9cd577f01dc8bd11d56aa7ffb022a69ad734e2aea');
		process.env.SALT = 'salt';
		process.env.TRAVIS_TOKEN = 'actual token innit';

		fakeReq.body.payload = JSON.stringify(receivedPayload);

		process.env.CONSUMER_KEY = 'consumer key';
		process.env.CONSUMER_SECRET = 'consumer secret';
		process.env.ACCESS_TOKEN_KEY = 'token key';
		process.env.ACCESS_TOKEN_SECRET = 'token secret';

		mockRes = sinon.mock(fakeRes).expects('json').once().withArgs({ result: 'success' });

		sendNotification(fakeReq, fakeRes, null);

		//TODO: find a better way!
		function doAssertions() {
			updateEndpoint.done();
			mockRes.verify();
			fakeRes.json.restore();
			fakeReq.get.restore();
			console.log('asserted!');
		}
	});
});
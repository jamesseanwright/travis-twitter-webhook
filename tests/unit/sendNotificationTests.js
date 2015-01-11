var nock = require('nock');
var sendNotification = require('../../routes/sendNotification');

var receivedPayload = {
	number: "1",
	status_message: "Passed",
	commit_message: "Commit message",
	build_url: "https://travis-ci.org/jamesseanwright/jamesswright.co.uk"
	repository: {
		name: "jamesswright.co.uk"
	}
};

var fakeReq = {
	body: {
		payload: {}
	},
	get: function (key) {} 
};

var fakeMiddleware = {
	next: function (err) {}
};

var fakeRes = {
	json: function (data);
};

var mockNext;
var mockRes;

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
		fakeReq.body.payload = receivedPayload;

		var expectedTweet = 'Build ' + receivedPayload.number + ' of ' + receivedPayload.repository.name + ' has ' + receivedPayload.status_message.toLower() + ': ' + receivedPayload.build_url;
		var updateEndpoint = nock('https://api.twitter.com/1.1')
								.post('statuses/update', {
									status: expectedTweet
								})
								.reply(200);

		mockRes = sinon.mock(fakeRes).expects('json').once().withArgs({ result: 'success' });

		sendNotification(fakeReq, fakeRes, null);

		updateEndpoint.done();
		mockRes.verify();
	});
});
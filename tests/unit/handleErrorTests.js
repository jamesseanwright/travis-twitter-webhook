var handleError = require('../../routes/handleError');
var fakeRes = {
	status: function (code) {},
	json: function (data) {}
};

var fakeMiddleware = {
	next: function (err) {}
}

var mockStatus;
var mockJson;
var mockNext;

describe('the handleError middleware', function () {
	it('should return the correct error', function () {
		var statusCode = 500;

		mockStatus = sinon.mock(fakeRes).expects('status').withArgs(statusCode).returns(fakeRes);
		mockJson = sinon.mock(fakeRes).expects('json').once();
		mockNext = sinon.mock(fakeMiddleware).expects('next').once();

		handleError(statusCode, null, fakeRes, fakeMiddleware.next);

		mockNext.verify();
		mockJson.verify();
		mockNext.verify();

		fakeRes.status.restore();
		fakeRes.json.restore();
		fakeMiddleware.next.restore();
	});
});
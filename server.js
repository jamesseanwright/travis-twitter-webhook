'use strict';

var express = require('express');
var app = express();
var sendNotification = require('./routes/sendNotification');
var handleError = require('./handleError');

app.post('/notifications', sendNotification);
app.use(handleError);

app.listen(3000, function () {
	console.log('Webhook server running on port', server.address().port
});
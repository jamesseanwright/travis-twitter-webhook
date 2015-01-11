'use strict';

var bodyParser = require('body-parser');
var express = require('express');
var app = express();
var sendNotification = require('./routes/sendNotification');
var handleError = require('./routes/handleError');

app.use(handleError);
app.use(bodyParser.urlencoded({ extended: false }));
app.post('/notifications', sendNotification, handleError);

app.listen(3000, function () {
	console.log('Webhook server running on port 3000');
});
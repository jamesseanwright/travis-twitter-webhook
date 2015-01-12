'use strict';

var bodyParser = require('body-parser');
var express = require('express');
var app = express();
var sendNotification = require('./routes/sendNotification');
var handleError = require('./routes/handleError');
var port = process.env.WEBHOOK_PORT || 3000

app.use(handleError);
app.use(bodyParser.urlencoded({ extended: false }));
app.post('/', sendNotification, handleError);

app.listen(port, function () {
	console.log('Webhook server running on port', port);
});
'use strict';

var express = require('express');
var morgan = require('morgan');
var compression = require('compression');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var port = process.env.PORT || 9000;
var app = express();

mongoose.connect(process.env.DB_URL);

app.use(morgan('dev'));
app.use(compression());
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ 'extended': 'true' }));
app.use(bodyParser.json());
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));

app.get('*', function (req, res) {
    res.sendFile(__dirname + '/public/index.html');
});

app.listen(port);
console.log('Server started: ' + port);
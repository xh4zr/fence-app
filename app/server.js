var express = require('express');
var http = require('http');
var readline = require('readline');

var app = express();
var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = 8080;

var router = express.Router();

app.use('/fence', express.static('fence-app/app/www'));

app.use('/real', express.static('real/static'));

http.createServer(app).listen(port);
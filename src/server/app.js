var express = require('express');
var path = require('path');
var app = express();
var route = require('./route');
var dataBase = require('./add.data');
var request = require('request');
var bodyParser = require("body-parser");

/**
 * Using additional modules
 */
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());

/**
 * Calculate route request handling
 */
var calculateRoute = function(request, response) {
	"use strict";

	if (request.query.type === 'subway') {
		getSubwayData(request, response);
	} else if (request.query.type === 'car') {
		getCarData(request, response);
	}
};

/**
 * Add new point request handling
 */
var addPoint = function(request, response) {
	"use strict";

	if (request.body[0].type === 'subway') {
		response.send(dataBase.addNewPoint(request.body, path.join(__dirname, 'public/data') + '/subway.json'));
	} else if (request.body[0].type === 'car') {
		response.send(dataBase.addNewPoint(request.body, path.join(__dirname, 'public/data') + '/car.json'));
	}
};

/**
 * Getting existing subway point request handling
 */
var getSubwayData = function(req, res) {
	"use strict";

	request("http://" + req.headers.host + '/data/subway.json', function (error, response, body) {
		if (!error && response.statusCode === 200) {
			route.init(body, { id: parseInt(req.query.start, 10) }, { id: parseInt(req.query.end) });

			res.send(route.calculatePath());
		}
	});
};

/**
 * Getting existing car point request handling
 */
var getCarData = function(req, res) {
	"use strict";

	request("http://" + req.headers.host + '/data/car.json', function (error, response, body) {
		if (!error && response.statusCode === 200) {
			route.init(body, { id: parseInt(req.query.start, 10) }, { id: parseInt(req.query.end) });

			res.send(route.calculatePath());
		}
	});
};

/**
 * handling requests
 */
app.post('/add-point', addPoint);
app.get('/calculate-route', calculateRoute);

/**
 * server port listening
 */
app.listen(8080);

var _ = require('underscore');

module.exports = {

	/**
	 * initialization default data
	 */
	init: function(pointsData, startPoint, endPoint) {
		this.currentPoint = {};
		this.nextPoint = {};
		this.permanentPoints = [];
		this.tempPointsData = [];
		this.initialPointsData = pointsData;
		this.startPoint = startPoint;
		this.endPoint = endPoint;
	},

	/**
	 * Calculating route
	 */
	calculatePath: function() {
		var response = {
			error: ''
		};

		if (!this.startPoint || !this.endPoint) {
			response.error = 'Server error. Wrong input data!';
			return response;
		}

		_.extend(response, this.calculateShortestPath());

		return response;
	},

	/**
	 * Calculating shortest route
	 */
	calculateShortestPath: function() {
		this.tempPointsData = JSON.parse(this.initialPointsData);

		this.updateFirstPointDistance();
		this.currentPoint = this.getStartPoint();
		this.makePointPermanent(this.currentPoint);
		this.findPermanentPoints();

		return this.getRoutePoints();
	},

	/**
	 * Getting point with the smallest distance
	 */
	getSmallestDistancePoint: function() {
		this.tempPointsData = _.sortBy(this.tempPointsData, "distance");

		return this.tempPointsData.shift();
	},

	/**
	 * Searching for start point
	 */
	getStartPoint: function() {
		return _.findWhere(this.tempPointsData, { id: this.startPoint.id });
	},

	/**
	 * Searching for end point
	 */
	getEndPoint: function() {
		return _.findWhere(this.permanentPoints, { id: this.endPoint.id });
	},

	/**
	 * Setting 0 distance for start point
	 */
	updateFirstPointDistance: function() {
		var startPoint = this.getStartPoint();

		startPoint.distance = 0;
	},

	/**
	 * Make point with the smallest distance as permanent
	 */
	makePointPermanent: function(point) {
		this.permanentPoints.push(point);
	},

	/**
	 * Find points with dijkstra algorithm
	 */
	findPermanentPoints: function() {
		while (this.currentPoint) {

			this.updateChildPointsDistances();

			this.nextPoint = this.getSmallestDistancePoint();

			if (_.isMatch(this.nextPoint, { id: this.endPoint.id })) {
				this.makePointPermanent(this.nextPoint);
				this.currentPoint = null;
			} else {
				this.currentPoint = this.nextPoint;
				this.makePointPermanent(this.currentPoint);
			}
		}
	},

	/**
	 * Reverse all founded points in order to find the route
	 */
	getRoutePoints: function() {
		var point = this.getEndPoint();
		var result = {
			route: [],
			totalDistance: point.distance
		};

		while (point) {
			result.route.unshift(point);

			if (!point.referer) {
				point = null;
				break;
			}

			point = _.findWhere(this.permanentPoints, { id: point.referer });
		}

		return result;
	},

	/**
	 * Updating child points distances
	 */
	updateChildPointsDistances: function() {
		this.currentPoint.childPoints.forEach(this.updateChildPointDistance.bind(this));
	},

	/**
	 * Updating child point distance
	 */
	updateChildPointDistance: function(child) {
		var childPoint = _.findWhere(this.tempPointsData, { id: child.id });
		var totalDistance = +this.currentPoint.distance + child.distance;

		if (childPoint && +childPoint.distance > totalDistance ) {
			childPoint.distance = totalDistance;
			childPoint.referer = this.currentPoint.id;
		}
	}
};

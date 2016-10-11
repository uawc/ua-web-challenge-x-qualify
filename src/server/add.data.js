var fs = require('fs');

var response = {
	error: ''
};

module.exports = {
	/**
	 * Adding new point to json
	 */
	addNewPoint: function(data, url) {
		'use strict';

		try {
			fs.writeFileSync(url, JSON.stringify(data));
		} catch (e) {
			response.error = 'Server error. Can\'t parse data';
			return response;
		}

		return response;
	}
};

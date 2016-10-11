export class MapRouteModel {
	coordinates: number[][];

	properties = {};

	options = {
		strokeWidth: 4,
		strokeColor: '#ff5353',
		opacity: 0.8
	};

	constructor(coordinates: number[][]) {
		this.coordinates = coordinates;
	}
}

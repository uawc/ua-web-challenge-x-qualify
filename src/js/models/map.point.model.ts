import { IPoint } from '../interfaces/point.interface';
import * as _ from 'underscore';

export class MapPointModel {
	coordinates: number[];

	properties =  {
		balloonContent: "",
		hintContent: "",
	};

	options = {
		preset: "islands#blueCircleDotIconWithCaption"
	};

	constructor(data: IPoint) {
		let children = _.pluck(data.childPoints, 'name').join(', ');
		let distances = _.pluck(data.childPoints, 'distance').join('m, ');

		this.coordinates = data.coordinates;
		this.properties.hintContent = data.name;
		this.options.preset = data.type === 'subway' ? "islands#blueRapidTransitCircleIcon" :  this.options.preset;
		this.properties.balloonContent = `Station <b>${data.name}</b>. Connected with <b>${children}</b>. Distances <b>${distances}m</b>`;
		
	}
}

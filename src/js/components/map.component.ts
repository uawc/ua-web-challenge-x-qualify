import { MenuComponent } from '../components/menu/menu.component';
import { BalloonModel } from '../models/balloon.model';
import { MapService } from '../services/map.service';
import { Component, OnInit } from '@angular/core';

@Component({
	selector: 'map',
	templateUrl: './templates/map.component.html',
	styleUrls: ['./css/map.component.css'],
	directives: [[MenuComponent]]
})

export class MapComponent implements OnInit {
	protected mode = 'route';
	protected coordinates = [];

	constructor(private mapService: MapService) {}
	
	ngOnInit(): void {
		this.mapService.mapScriptLoaded
			.then(this.onMapReady.bind(this));
	}

	/**
	 * Handling balloon "startPoint" and "endPoint" clicking
	 */
	protected onBalloonClick(event: any): void {
		let currentClass = event.target.className;
		let coordinates = event.target.dataset.coordinates || '';
		
		switch (currentClass) {
			case 'pick-as-start-point':
				this.mapService.findClosestPoint(coordinates.split(","), true);
				break;
			case 'pick-as-end-point':
				this.mapService.findClosestPoint(coordinates.split(","), false);
				break;
			default:
				break;
		}
	}

	/**
	 * Binding custom map events
	 */
	protected bindEvents(): void {
		this.mapService.map.events.add('click', this.onMapClick.bind(this));
	}

	/**
	 * Opening balloon or checking click event coordinates
	 */
	protected onMapClick(event: any) {
		this.coordinates = [];
		
		if (this.mapService.mapMode === 'route') {
			this.openBalloon(event);
		} else {
			this.coordinates[0] = event.get('coords')[0].toPrecision(6);
			this.coordinates[1] = event.get('coords')[1].toPrecision(6);
		}
	}

	/**
	 * Opening balloon
	 */
	private openBalloon(event: any): void {
		let coords = event.get('coords');
		let options = new BalloonModel(coords);

		this.mapService.map.balloon.open(coords, options);
	}

	/**
	 * Bind Events on map loading
	 */
	protected onMapReady(): void {
		this.bindEvents();
	}
}

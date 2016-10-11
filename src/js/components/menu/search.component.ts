import { IPointDistance } from '../../interfaces/point.distance.interface';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ServerService } from '../../services/server.service';
import { MapService } from '../../services/map.service';
import { TransportComponent } from './transport.component';
import { IPoint } from '../../interfaces/point.interface';

@Component({
	selector: 'search',
	templateUrl: './templates/menu/search.component.html',
	styleUrls: ['./css/menu/search.component.css'],
	directives: [[ TransportComponent ]]
})

export class SearchComponent implements OnInit{
	protected points: IPoint[];
	protected startPoint: number;
	protected endPoint: number;
	protected transportType = 'subway';
	
	@Output() error = new EventEmitter();

	constructor(private serverService: ServerService, private mapService: MapService) {}
	
	ngOnInit() {
		this.serverService.subwayPointsDataReceived$.subscribe(this.setInitialSelectData.bind(this));
		this.serverService.carPointsDataReceived$.subscribe(this.setInitialSelectData.bind(this));
		this.mapService.closestPointFound$.subscribe(this.changeSelect.bind(this));
	}

	/**
	 * Requesting points data on transport type clicking
	 */
	protected onTransportChange(type: string): void {
		this.transportType = type;
		
		switch (type) {
			case 'subway':
				this.serverService.getSubwayPoints();
				break;
			case 'car':
				this.serverService.getCarPoints();
				break;
			default:
				break;
		}
	}

	/**
	 * Setting default data for "select" element
	 */
	protected setInitialSelectData(response: IPoint[]): void {
		this.points = response;

		this.startPoint = 1;
		this.endPoint = response.length;
	}

	/**
	 * Changing default "select" value
	 */
	protected changeSelect(pointDistance: IPointDistance): void {
		if (pointDistance.isStartPoint) {
			this.startPoint = pointDistance.id;
		} else {
			this.endPoint = pointDistance.id;
		}
	}

	/**
	 * On search submit handler
	 */
	protected onSubmitClick(): void {
		if (this.startPoint === this.endPoint) {
			this.error.emit(`It's seems that you're already here` );
			return;
		}
		this.getRoute();
	}

	/**
	 * Getting route from server
	 */
	protected getRoute(): void {
		switch (this.transportType) {
			case 'subway':
				this.serverService.getRoute(this.startPoint, this.endPoint, 'subway');
				break;
			case 'car':
				this.serverService.getRoute(this.startPoint, this.endPoint, 'car');
		}
	}
}

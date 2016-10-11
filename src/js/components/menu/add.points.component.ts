import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { IChildPoint } from '../../interfaces/point.child.interface';
import { ServerService } from '../../services/server.service';
import { TransportComponent } from './transport.component';
import { IPoint } from '../../interfaces/point.interface';
import { MapService } from '../../services/map.service';
import * as _ from 'underscore';

@Component({
	selector: 'addpoints',
	templateUrl: './templates/menu/add.points.component.html',
	styleUrls: ['./css/menu/add.points.component.css'],
	directives: [[TransportComponent]]
})

export class AddPointsComponent implements OnInit {
	protected points: IPoint[];
	protected childPoint: number;
	protected pointDistance: number;
	protected pointName: string;
	protected childPoints = [] as IChildPoint[];
	protected isConnectable = true;

	@Input() coordinates: number[];
	@Output() error = new EventEmitter();

	transportType = 'subway';

	constructor(private serverService: ServerService, private mapService: MapService) {}

	ngOnInit(): void {
		this.serverService.subwayPointsDataReceived$.subscribe(this.setInitialSelectData.bind(this));
		this.serverService.carPointsDataReceived$.subscribe(this.setInitialSelectData.bind(this));
	}

	/**
	 * Setting default data for select element
	 */
	protected setInitialSelectData(response: IPoint[]): void {
		this.points = response;

		this.childPoint = 1;
	}

	/**
	 * Cleaning and populating map with points on transport icon clicking
	 */
	protected onTransportChange(type: string): void {
		this.transportType = type;
		this.mapService.clearMap();
		this.resetData();
		this.updatePoints(type);
	}

	/**
	 * Requesting points data
	 */
	protected updatePoints(type: string): void {
		switch (type) {
			case 'subway':
				this.serverService.getSubwayPoints().then((response) => this.mapService.drawPoints(response));
				break;
			case 'car':
				this.serverService.getCarPoints().then((response) => this.mapService.drawPoints(response));
				break;
			default:
				break;
		}
	}

	/**
	 * Resetting all new point data
	 */
	protected resetData(): void {
		this.coordinates = [];
		this.childPoint = 1;
		this.isConnectable = true;
		this.pointDistance = null;
		this.pointName = '';
		this.childPoints = [];
		this.error.emit('');
	}

	/**
	 * Adding new child relationship
	 */
	protected onAddConnection(): void {
		let childPoint = _.findWhere(this.points, { id: this.childPoint });

		this.error.emit('');

		if (!this.childPoint || !childPoint.name || !this.pointDistance) {
			this.error.emit('Fields data are not valid');
			return;
		}
		
		this.childPoints.push({
			id: this.childPoint,
			name: childPoint.name,
			distance: +this.pointDistance,
			isConnectable: this.isConnectable
		});
	}

	/**
	 * on add point button clicking handler
	 */
	protected onAddPoint(): void {
		this.error.emit('');
		
		if (!this.coordinates.length || !this.pointName || !this.childPoint || !this.childPoints.length) {
			this.error.emit('Fields data are not valid');
			return;
		}

		this.sendPointData(this.generatePointData());
	}

	/**
	 * creating Point data for making request with
	 */
	protected generatePointData(): IPoint[] {
		let sortedPoints = _.sortBy(this.points, 'id');
		let pointId = sortedPoints[sortedPoints.length -1].id + 1;

		this.addConnectionToChild(pointId);

		this.points.push({
			id: pointId,
			name: this.pointName,
			type: this.transportType,
			coordinates: this.coordinates,
			childPoints: this.childPoints,
			distance: "Infinity"
		});

		return this.points;
	}

	/**
	 * Adding current point to child points
	 */
	protected addConnectionToChild(pointId: number): void {
		this.childPoints.forEach((point: IChildPoint) => {
			if (point.isConnectable) {
				let childPoint = <IPoint>_.findWhere(this.points, { id: point.id });

				childPoint.childPoints.push({
					id: pointId,
					name: this.pointName,
					distance: +this.pointDistance,
					isConnectable: point.isConnectable
				})
			}
		});
	}

	/**
	 * sending point data to server
	 */
	protected sendPointData(points: IPoint[]): void {
		this.serverService.addNewPoint(points).then((response: any) => {
			if (response.error) {
				this.error.emit(response.error);
			} else {
				this.resetData();
				this.updatePoints(this.transportType);
			}
		});
	}
}

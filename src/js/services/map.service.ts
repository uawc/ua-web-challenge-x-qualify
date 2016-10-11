import { Injectable } from '@angular/core';
import { MapModel } from '../models/map.model';
import { Subject } from 'rxjs/Subject';
import { ServerService } from '../services/server.service';
import { MapPointModel } from '../models/map.point.model';
import { MapRouteModel } from '../models/map.route.model';
import { IPoint } from '../interfaces/point.interface';
import { IResponse } from '../interfaces/response.route.interface';
import { IPointDistance } from '../interfaces/point.distance.interface';

@Injectable()
export class MapService {
	protected pointsData: IPoint[];
	protected closestPointFound = new Subject<IPointDistance>();

	public map: any;
	public mapMode = 'route';
	public mapScriptLoaded: Promise<any>;
	public closestPointFound$ = this.closestPointFound.asObservable();
	
	
	constructor(private serverService: ServerService) {
		this.mapScriptLoaded = ymaps.ready()
			.then(this.onYMapReady.bind(this));

		this.serverService.routeDataReceived$
			.subscribe(this.drawRouteWithPoints.bind(this));

		this.serverService.subwayPointsDataReceived$
			.subscribe((response: IPoint[]) => this.pointsData = response);

		this.serverService.carPointsDataReceived$
			.subscribe((response: IPoint[]) => this.pointsData = response);
	}

	/**
	 * Creating new map instance on ymap ready
	 */
	protected onYMapReady(): void {
		let map = new MapModel();
		
		this.map = new ymaps.Map(map.id, map.defaults);
	}

	/**
	 * Creating point icon on the map
	 */
	protected createPlacemark(mapPointModel: MapPointModel): any {
		return new ymaps.Placemark(mapPointModel.coordinates, mapPointModel.properties, mapPointModel.options);
	}

	/**
	 * Creating line on the map
	 */
	protected createPolyline(mapRouteModel: MapRouteModel): any {
		return new ymaps.Polyline(mapRouteModel.coordinates, mapRouteModel.properties , mapRouteModel.options);
	}

	/**
	 * Clear all elements from map
	 */
	public clearMap(): void {
		this.map.geoObjects.removeAll();
	}

	/**
	 * Drawing route with points on the map
	 */
	public drawRouteWithPoints(response: IResponse): void {
		let routePoints = response.route || [];

		this.clearMap();

		this.drawRoute(routePoints);
		this.drawPoints(routePoints);
	}

	/**
	 * Drawing points on the map
	 */
	public drawPoints(routePoints: IPoint[]): void {
		routePoints.forEach((point: IPoint) => {
			let mapPointModel = new MapPointModel(point);
			let mapPoint = this.createPlacemark(mapPointModel);

			this.map.geoObjects.add(mapPoint);
		});
	}

	/**
	 * Drawing route on the map
	 */
	public drawRoute(routePoints: IPoint[]): void {
		let points = [];

		routePoints.forEach((point: IPoint) => points.push(point.coordinates));

		let mapRouteModel = new MapRouteModel(points);
		let mapRoute = this.createPolyline(mapRouteModel);

		this.map.geoObjects.add(mapRoute);
	}

	/**
	 * Searching for closest point
	 */
	public findClosestPoint(coordinates: number[], isStartPoint: boolean): void {
		let pointsDistances = [] as IPointDistance[];

		if (_.isEmpty(this.pointsData)) {
			return;
		}

		this.pointsData.forEach((point: IPoint) => {
			let distance = Math.abs(coordinates[0] - point.coordinates[0]) + Math.abs(coordinates[1] - point.coordinates[1]);

			pointsDistances.push({
				id: point.id,
				isStartPoint: !!isStartPoint,
				distance
			});
		});

		this.closestPointFound.next(_.sortBy(pointsDistances, "distance").shift());
	}
}

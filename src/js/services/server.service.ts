import { Injectable } from '@angular/core';
import 'rxjs/add/operator/toPromise';
import { Subject } from 'rxjs/Subject';
import { IResponse } from '../interfaces/response.route.interface';
import { IPoint } from '../interfaces/point.interface';
import { Http, Headers, RequestOptions } from '@angular/http';

@Injectable()
export class ServerService {
	protected subwayDataUrl = "/data/subway.json";
	protected carDataUrl = "/data/car.json";
	protected subwayRouteUrl = "/calculate-route";
	protected routeDataReceived = new Subject<IResponse>();
	protected subwayPointsDataReceived = new Subject<IPoint[]>();
	protected carPointsDataReceived = new Subject<IPoint[]>();
	protected serverErrors = new Subject<string>();

	public routeDataReceived$ = this.routeDataReceived.asObservable();
	public subwayPointsDataReceived$ = this.subwayPointsDataReceived.asObservable();
	public carPointsDataReceived$ = this.carPointsDataReceived.asObservable();
	public serverErrors$ = this.serverErrors.asObservable();

	constructor(private http: Http) {}

	/**
	 * announce to subscribers about route data receiving
	 */
	protected announceRouteDataReceived(response: IResponse): IResponse {
		this.routeDataReceived.next(response);

		return response;
	}

	/**
	 * announce to subscribers about subway points data receiving
	 */
	protected announceSubwayPointsDataReceived(response: IPoint[]): IPoint[] {
		this.subwayPointsDataReceived.next(response);

		return response;
	}

	/**
	 * announce to subscribers about car points data receiving
	 */
	protected announceCarPointsDataReceived(response: IPoint[]): IPoint[] {
		this.carPointsDataReceived.next(response);

		return response;
	}

	/**
	 * handling common server error
	 */
	protected handleServerError() {
		this.serverErrors.next(`Server error`);
	}

	/**
	 * handling custom server error
	 */
	protected handleError(response) {
		if (response.error) {
			this.serverErrors.next(response.error);
		}

		return response;
	}

	/**
	 * Getting list of subway points
	 */
	public getSubwayPoints(): Promise<any> {
		return this.http
			.get(this.subwayDataUrl)
			.toPromise()
			.then(response => response.json())
			.then(this.handleError.bind(this))
			.then((response: IPoint[]) => this.announceSubwayPointsDataReceived(response))
			.catch(this.handleError.bind(this));
	}

	/**
	 * Getting list of car points
	 */
	public getCarPoints(): Promise<any> {
		return this.http
			.get(this.carDataUrl)
			.toPromise()
			.then(response => response.json())
			.then(this.handleError.bind(this))
			.then((response: IPoint[]) => this.announceCarPointsDataReceived(response))
			.catch(this.handleServerError.bind(this));
	}

	/**
	 * Getting calculated route
	 */
	public getRoute(startPoint: number, endPoint: number, type: string): Promise<any> {
		return this.http
			.get(`${this.subwayRouteUrl}?start=${startPoint}&end=${endPoint}&type=${type}`)
			.toPromise()
			.then(response => response.json())
			.then(this.handleError.bind(this))
			.then((response: IResponse) => this.announceRouteDataReceived(response))
			.catch(this.handleServerError.bind(this));
	}

	/**
	 * sending new point to the server
	 */
	public addNewPoint(points: IPoint[]): Promise<any> {
		let body = JSON.stringify(points);
		let headers = new Headers({ 'Content-Type': 'application/json' });
		let options = new RequestOptions({ headers: headers });

		return this.http
			.post('/add-point', body, options)
			.toPromise()
			.then(response => response.json())
			.then(this.handleError.bind(this));
	}
}

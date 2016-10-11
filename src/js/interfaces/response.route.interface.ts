import { IPoint } from './point.interface';

export interface IResponse {
	route: IPoint[];
	error: string;
	totalDistance: number;
}

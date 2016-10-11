import { IChildPoint } from './point.child.interface'

export interface IPoint {
	id: number;
	name: string;
	type: string;
	coordinates: number[];
	childPoints: IChildPoint[];
	distance: string;
}

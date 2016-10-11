export class BalloonModel {
	contentHeader = 'Select closest point as:';
	contentBody = '';

	constructor(coordinates: number[]) {
		let coordinatesStr = `${coordinates[0]},${coordinates[1]}`;
		
		this.contentBody = `<div class="balloon-actions-wrapper">
								<div data-coordinates="${coordinatesStr}" class="pick-as-start-point">A</div>
								<div data-coordinates="${coordinatesStr}" class="pick-as-end-point">B</div>
							</div>`
	}
}

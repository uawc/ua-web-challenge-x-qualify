import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ServerService } from '../../services/server.service';
import { MapService } from '../../services/map.service';
import { IItem } from '../../interfaces/item.interface';

@Component({
	selector: 'buttons',
	templateUrl: './templates/menu/buttons.component.html',
	styleUrls: ['./css/menu/buttons.component.css']
})

export class ButtonsComponent implements OnInit {
	protected buttons: IItem[];
	protected selectedButton: IItem;

	@Output() mode = new EventEmitter();

	constructor(private serverService: ServerService, private mapService: MapService) {}

	ngOnInit(): void {
		this.buttons = [{ name: "route", text: "Route"}, { name: "addPoint", text: "Add new points" }];
		this.selectedButton = this.buttons[0];
	}

	/**
	 * Requesting default points and drawing them on the map
	 */
	protected onClick(button: IItem): void {
		this.selectedButton = button;
		this.mode.emit(button.name);

		this.mapService.mapMode = button.name;

		this.mapService.clearMap();

		this.serverService.getSubwayPoints().then((response) => {
			return button.name === 'addPoint' ? this.mapService.drawPoints(response) : response
		});
	}
}

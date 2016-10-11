import { Component, OnInit } from '@angular/core';
import { ServerService } from '../services/server.service';

@Component({
	selector: 'app',
	templateUrl: './templates/app.component.html',
	styleUrls: ['./css/app.component.css']
})

export class AppComponent implements OnInit {
	constructor(private serverService: ServerService) {}

	ngOnInit() {
		this.serverService.getSubwayPoints();
	}
}

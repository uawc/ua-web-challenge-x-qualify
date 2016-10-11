import { Component, Input, OnInit } from '@angular/core';
import { SearchComponent } from './search.component';
import { ButtonsComponent } from './buttons.component';
import { AddPointsComponent } from './add.points.component';
import { ServerService } from '../../services/server.service';

@Component({
	selector: 'menu',
	templateUrl: './templates/menu/menu.component.html',
	styleUrls: ['./css/menu/menu.component.css'],
	directives: [[SearchComponent], [ButtonsComponent], [AddPointsComponent]],
})

export class MenuComponent implements OnInit {
	protected error: string;
	protected mode = 'route';

	@Input() coordinates: number[];
	
	constructor(private serverService: ServerService) {}

	ngOnInit(): void {
		this.serverService.serverErrors$.subscribe(this.onError.bind(this));
	}

	/**
	 * Updating map mode state
	 */
	protected onModeChange(mode: string): void {
		this.mode = mode;
		this.error = '';
	}

	/**
	 * handling errors from child
	 */
	protected onError(error: string): void {
		this.error = error;
	}
}

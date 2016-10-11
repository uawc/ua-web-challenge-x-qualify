import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { IItem } from '../../interfaces/item.interface';

@Component({
	selector: 'transport',
	templateUrl: './templates/menu/transport.component.html',
	styleUrls: ['./css/menu/transport.component.css']
})

export class TransportComponent implements OnInit {
	protected transports: IItem[];
	protected selectedTransport: IItem;
	
	@Output() selected = new EventEmitter();

	ngOnInit(): void {
		this.transports = [{ name: "subway"}, { name: "car" }];
		this.selectedTransport = this.transports[0];
	}

	/**
	 * Bubbling event to parent on transport icon clicking
	 */
	protected onClick(transport: IItem): void {
		this.selectedTransport = transport;

		this.selected.emit(transport.name);
	}
}

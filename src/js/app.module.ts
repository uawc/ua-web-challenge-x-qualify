import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HTTP_PROVIDERS } from '@angular/http';
import { MapComponent } from './components/map.component';
import { MapService } from './services/map.service';
import { ServerService } from './services/server.service';
import { AppComponent }  from './components/app.component';

@NgModule({
	imports: [[BrowserModule, FormsModule]],
	declarations: [[AppComponent]],
	bootstrap: [[AppComponent], [MapComponent]],
	providers: [[HTTP_PROVIDERS], [MapService], [ServerService]]
})

export class AppModule {}

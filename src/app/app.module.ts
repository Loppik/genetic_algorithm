import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ChartsModule } from 'ng2-charts';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MatrixComponent } from './matrix/matrix.component';
import { SettingsComponent } from './settings/settings.component';
import { MainGraphComponent } from './main-graph/main-graph.component';

import { MatrixService } from './matrix.service';
import { SettingsService } from './settings.service';
import {ReactiveFormsModule} from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    MatrixComponent,
    SettingsComponent,
    MainGraphComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ChartsModule,
    ReactiveFormsModule
  ],
  providers: [MatrixService, SettingsService],
  bootstrap: [AppComponent]
})
export class AppModule { }

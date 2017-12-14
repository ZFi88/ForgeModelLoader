import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';


import {AppComponent} from './app.component';
import {MaterialModule} from './modules/material.module';
import {HttpClientModule} from '@angular/common/http';
import {ReactiveFormsModule} from '@angular/forms';
import {ForgeService} from './services/forge.service';
import {SnackService} from './services/snack.service';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { ViewerComponent } from './viewer/viewer.component';


@NgModule({
  declarations: [
    AppComponent,
    ViewerComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MaterialModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [ForgeService, SnackService],
  bootstrap: [AppComponent]
})
export class AppModule {
}

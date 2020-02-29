import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DurationInputComponent } from './shared/duration-input/duration-input.component';
import { DurationComponent } from './testing-components/duration/duration.component';
import { DurationInputDirective } from './shared/duration-input/duration-input.directive';

@NgModule({
  declarations: [
    AppComponent,
    DurationInputComponent,
    DurationComponent,
    DurationInputDirective
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

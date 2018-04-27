import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { MestachesComponent } from './mestaches/mestaches.component';
import { NavComponent } from './nav/nav.component';
import { GestionComponent } from './gestion/gestion.component';
import { VisuGestionComponent } from './visu-gestion/visu-gestion.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    MestachesComponent,
    NavComponent,
    GestionComponent,
    VisuGestionComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

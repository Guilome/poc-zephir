import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { MestachesComponent } from './mestaches/mestaches.component';
import { NavComponent } from './nav/nav.component';
import { GestionComponent } from './gestion/gestion.component';
import { VisuGestionComponent } from './visu-gestion/visu-gestion.component';
import { QuiSommeNousComponent } from './nav-bar/qui-somme-nous/qui-somme-nous.component';
import { DevenirCourtierPartenaireComponent } from './nav-bar/devenir-courtier-partenaire/devenir-courtier-partenaire.component';
import { NosSolutionsComponent } from './nav-bar/nos-solutions/nos-solutions.component';
import { ActualitesComponent } from './nav-bar/actualites/actualites.component';
import { RecrutementComponent } from './nav-bar/recrutement/recrutement.component';
import { EspacePresseComponent } from './nav-bar/espace-presse/espace-presse.component';
import { ContactComponent } from './nav-bar/contact/contact.component';

const appRoutes: Routes = [
  { path: 'Qui sommes nous ?', component: QuiSommeNousComponent},
  { path: 'Devenir-courtier-partenaire', component: DevenirCourtierPartenaireComponent},
  { path: 'Nos solutions', component: NosSolutionsComponent},
  { path: 'Actualités', component: ActualitesComponent},
  { path: 'Recrutement', component: RecrutementComponent},
  { path: 'Espace-Presse', component: EspacePresseComponent},
  { path: 'Contact', component: ContactComponent},
  { path: 'gestionBO', component: VisuGestionComponent},
  { path: '**', redirectTo: 'gestionBO'}
];
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    MestachesComponent,
    NavComponent,
    GestionComponent,
    VisuGestionComponent,
    QuiSommeNousComponent,
    DevenirCourtierPartenaireComponent,
    NosSolutionsComponent,
    ActualitesComponent,
    RecrutementComponent,
    EspacePresseComponent,
    ContactComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(appRoutes),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

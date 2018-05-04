import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {ActivatedRoute, RouterModule, Routes} from '@angular/router';
import {FormsModule} from '@angular/forms';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
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
import {TacheService} from './shared/services/tache.service';
import { TraitementTacheComponent } from './traitement/traitement-tache/traitement-tache.component';
import { DetailTacheComponent } from './traitement/traitement-tache/detail-tache/detail-tache.component';
import { ApercuDocumentComponent } from './traitement/traitement-tache/apercu-document/apercu-document.component';
import { ConformiteComponent } from './traitement/traitement-tache/conformite/conformite.component';
import {EditTacheComponent} from './traitement/traitement-tache/edit-tache/edit-tache.component';

const appRoutes: Routes = [
  { path: 'Qui sommes nous ?', component: QuiSommeNousComponent},
  { path: 'Devenir-courtier-partenaire', component: DevenirCourtierPartenaireComponent},
  { path: 'Nos solutions', component: NosSolutionsComponent},
  { path: 'Actualités', component: ActualitesComponent},
  { path: 'Recrutement', component: RecrutementComponent},
  { path: 'Espace-Presse', component: EspacePresseComponent},
  { path: 'Contact', component: ContactComponent},
  { path: 'gestionBO', component: VisuGestionComponent},
  { path: 'TraitementTache', component: TraitementTacheComponent},
  { path: 'TraitementTache/:id', component: TraitementTacheComponent},
  { path: 'EditTache', component: EditTacheComponent},
  { path: '**', redirectTo: 'gestionBO'}
];
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    NavComponent,
    GestionComponent,
    VisuGestionComponent,
    QuiSommeNousComponent,
    DevenirCourtierPartenaireComponent,
    NosSolutionsComponent,
    ActualitesComponent,
    RecrutementComponent,
    EspacePresseComponent,
    ContactComponent,
    TraitementTacheComponent,
    DetailTacheComponent,
    ApercuDocumentComponent,
    ConformiteComponent,
    EditTacheComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(appRoutes),
    FormsModule
  ],
  providers: [TacheService],
  bootstrap: [AppComponent]
})
export class AppModule { }

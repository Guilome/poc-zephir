import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {ActivatedRoute, RouterModule, Routes} from '@angular/router';
import {FormsModule} from '@angular/forms';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { NavComponent } from './nav/nav.component';
import { GestionComponent } from './visu-gestion/gestion/gestion.component';
import { VisuGestionComponent } from './visu-gestion/visu-gestion.component';
import { QuiSommeNousComponent } from './nav/nav-bar/qui-somme-nous/qui-somme-nous.component';
import { DevenirCourtierPartenaireComponent } from './nav/nav-bar/devenir-courtier-partenaire/devenir-courtier-partenaire.component';
import { NosSolutionsComponent } from './nav/nav-bar/nos-solutions/nos-solutions.component';
import { ActualitesComponent } from './nav/nav-bar/actualites/actualites.component';
import { RecrutementComponent } from './nav/nav-bar/recrutement/recrutement.component';
import { EspacePresseComponent } from './nav/nav-bar/espace-presse/espace-presse.component';
import { ContactComponent } from './nav/nav-bar/contact/contact.component';
import {TacheService} from './shared/services/tache.service';
import { TraitementTacheComponent } from './traitement/traitement-tache/traitement-tache.component';
import { DetailTacheComponent } from './traitement/traitement-tache/detail-tache/detail-tache.component';
import { ApercuDocumentComponent } from './traitement/traitement-tache/apercu-document/apercu-document.component';
import { ConformiteComponent } from './traitement/traitement-tache/conformite/conformite.component';
import {EditTacheComponent} from './traitement/traitement-tache/edit-tache/edit-tache.component';
import {NoteService} from './shared/services/note.service';
import { NouvelleNoteComponent } from './traitement/nouvelle-note/nouvelle-note.component';
import {GroupeService} from './shared/services/groupe.service';
import {NavGestionComponent} from './nav/nav-gestion/nav-gestion.component';
import {TitreService} from './shared/services/titre.service';
import {InformationConducteurComponent} from './traitement/traitement-tache/conformite/information-conducteur/information-conducteur.component';
import {CommonModule} from '@angular/common';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ToastrModule} from 'ngx-toastr';
import {TooltipModule} from 'ng2-tooltip-directive';
import {PopoverModule} from 'ng4-popover';
import {UtilisateurService} from './shared/services/utilisateur.service';
import { AccueilComponent } from './accueil/accueil.component';

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
  { path: 'NouvelleNote', component: NouvelleNoteComponent},
  { path: 'Connexion', component: LoginComponent},
  { path: 'Accueil', component: AccueilComponent},

  { path: '**', redirectTo: 'Accueil'}
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
    EditTacheComponent,
    NouvelleNoteComponent,
    NavGestionComponent,
    InformationConducteurComponent,
    AccueilComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(appRoutes),
    FormsModule,
    CommonModule,
    BrowserAnimationsModule, // required animations module
    ToastrModule.forRoot(),
    TooltipModule,
    PopoverModule
],
  providers: [TacheService, NoteService, GroupeService, TitreService, UtilisateurService],
  bootstrap: [AppComponent]
})
export class AppModule { }

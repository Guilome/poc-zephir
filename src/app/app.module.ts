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
import { ActionMetierService } from './shared/services/action-metier.service';
import { DonnerTacheComponent } from './affecter-tache/donner-tache/donner-tache.component';
import { GestionnaireComponent } from './affecter-tache/gestionnaire/gestionnaire.component';
import { TacheNonAffecteComponent } from './affecter-tache/tache-non-affecte/tache-non-affecte.component';
import { PrendreTacheComponent } from './affecter-tache/prendre-tache/prendre-tache.component';
import { VisuSuperviseurComponent } from './visu-superviseur/visu-superviseur.component';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown/angular2-multiselect-dropdown';
import { GraphiqueEnCoursComponent } from './visu-superviseur/graphique-en-cours/graphique-en-cours.component';
import { GraphiqueTermineComponent } from './visu-superviseur/graphique-termine/graphique-termine.component'
import { SplitPipe } from './shared/pipe/split.pipe';
import { TableTreeContratComponent } from './visu-gestion/table-tree-contrat/table-tree-contrat.component';
import { NgbModule, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { InformationCgComponent } from './traitement/traitement-tache/conformite/information-cg/information-cg.component';
import { InformationPcComponent } from './traitement/traitement-tache/conformite/information-pc/information-pc.component';
import { ModificationService } from './shared/services/modification.service';
import { VisualiserModificationComponent } from './traitement/traitement-tache/visualiser-modification/visualiser-modification.component';
import { BannettePipe } from './shared/pipe/bannette.pipe';

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
  { path: 'AffecterTache', component: DonnerTacheComponent},
  { path: 'PrendreTache', component: PrendreTacheComponent},
  { path: 'GestionGroupe/:id', component: VisuSuperviseurComponent},

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
    AccueilComponent,
    DonnerTacheComponent,
    GestionnaireComponent,
    TacheNonAffecteComponent,
    PrendreTacheComponent,
    VisuSuperviseurComponent,
    GraphiqueEnCoursComponent,
    SplitPipe,
    TableTreeContratComponent,
    GraphiqueTermineComponent,
    InformationCgComponent,
    InformationPcComponent,
    VisualiserModificationComponent,
    BannettePipe
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(appRoutes),
    FormsModule,
    CommonModule,
    BrowserAnimationsModule, // required animations module
    ToastrModule.forRoot(),
    TooltipModule,
    PopoverModule,
    AngularMultiSelectModule,
    NgbModule.forRoot()
  ],
  providers: [TacheService, 
              NoteService, 
              GroupeService, 
              TitreService, 
              UtilisateurService, 
              ActionMetierService, 
              ModificationService,
              NgbActiveModal
          ],
  bootstrap: [AppComponent]
})
export class AppModule { }
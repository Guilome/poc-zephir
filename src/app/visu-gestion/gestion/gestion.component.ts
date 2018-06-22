import { Component, Input, OnInit} from '@angular/core';
import {TacheService} from '../../shared/services/tache.service';
import { Tache } from '../../shared/domain/Tache';
import {NoteService} from '../../shared/services/note.service';
import {Router} from '@angular/router';
import {Chart} from 'chart.js';
import {GroupeService} from '../../shared/services/groupe.service';
import { Groupe} from '../../shared/domain/groupe';
import {ToastrService} from 'ngx-toastr';
import { Utilisateur} from '../../shared/domain/Utilisateur';
import { UtilisateurService } from '../../shared/services/utilisateur.service';
import { ActionMetierService } from '../../shared/services/action-metier.service';
import { Contrat } from '../../shared/domain/contrat';
import { ProfilCode } from '../../shared/domain/Profil';

@Component({
  selector: 'app-gestion',
  templateUrl: './gestion.component.html',
  styleUrls: ['./gestion.component.css'] 
})
export class GestionComponent implements OnInit {

  @Input() titre: string;
  @Input() card: string;
  @Input() profil: ProfilCode;  
  eye = false;
  search = false;
  share = false;
  inbox = false;
  outbox = false;
  take = false;
  calendar = false;
  file = false;
  filter = false;
  refresh = false;
  chart = false;
  trash = false;
  numId = 0; // card ID

  boolDateCloture = false;

  // Boolean :
  tacheBoolean = false;
  noteBoolean = false;
  groupeBoolean = false;
  actionMetier = false;
  dossierBoolean = false

  // Liste :
  taches = []
  groupes = []
  actionMetiers = []
  contrats = []
  // map groupe key/value
  dataGroupe: Map<string, number>;

  // Current Utilisateur :
  idCurrentUser;

  utilisateur:Utilisateur 

  context: any;
  public c: Chart;
  // Contructor :
  constructor(public tacheService: TacheService,
              public noteService: NoteService,
              private router: Router,
              private groupeService: GroupeService,
              private toastr: ToastrService,
              private utilService: UtilisateurService,
              private actionMetierService: ActionMetierService) {

  }


  ngOnInit() {
    this.idCurrentUser = parseInt(localStorage.getItem('USER'));
    this.utilisateur = this.utilService.getUserById(this.idCurrentUser)

    if (this.titre === 'Actions métier') {
      this.mesActionsMetier();
      this.actionMetiers =this.actionMetierService.listActionMetier;
      this.actionMetier = true;
      this.numId = 2;
    } else if (this.titre === 'Mes groupes') {
      this.profil = this.utilisateur.profil.code
      this.utilisateur.profil.groupes.forEach(g => this.groupes.push(this.groupeService.getGroupeById(g)))
      this.groupeBoolean = true;
      this.numId = 3;
    } else if (this.titre === 'Mes Notes') {
      this.mesNotes();
      this.numId = 4;
      this.noteBoolean = true;
      // récupération des données :
      this.noteService.listerNotes().subscribe(data => this.taches = data);
    } else if (this.titre === 'Dossier pièces justificatives') {
      this.mesDossiers()
      this.dossierBoolean = true;        
      } else {
      this.numId = Math.floor(Math.random() * (999999 - 100000)) + 100000;
    }
  }

  voirNoteTerminer(dateCloture: any): boolean {
    if ( dateCloture != null) {
      return this.boolDateCloture;
    }
    return true;
  }
  visualiser(eye) {
    // NOTES
    if (this.noteBoolean) {

      this.boolDateCloture = !this.boolDateCloture;
      if ( this.boolDateCloture ) {
        eye.classList.add('del');
        eye.title = 'Cacher mes notes terminée';
      } else {
        eye.classList.remove('del');
        eye.title = 'Voir mes notes terminée';
      }
    }
  }
  prendreTache() {
    if(this.dossierBoolean) {
      this.router.navigate(['/PrendreTache'])
    }
  }
  nouvelleTache() {
    if (this.noteBoolean) {
      this.router.navigate(['/NouvelleNote']);
    } else if (this.tacheBoolean) {
      this.router.navigate(['/EditTache']);
    }
  }
  fermerNote(idNote) {
    this.noteService.fermer(idNote);
    document.getElementById('tr' + idNote).classList.add('del');
  }
  ouvrirNote(idNote) {

    this.noteService.reOuvrir(idNote);
    document.getElementById('tr' + idNote).classList.remove('del');

  }
  supprimerNote(idNote: number) {
    if (confirm('Confirmer-vous la suppression définitive de cette note ?')) {
      this.noteService.removeNote(idNote);
    }
  }

  private mesDossiers() {
    this.calendar = true;
    this.chart = true;
    this.refresh = true;
    this.inbox = true;
    this.outbox = true;
    this.take = true;
  }

  private mesActionsMetier() {
    this.eye = true;
    this.search = true;
    this.inbox = true;
    this.file = true;
    this.filter = true;
    this.refresh = true;
  }

  private mesNotes() {
    this.file = true;
    this.eye = true;
    this.refresh = true;
    this.trash = true;
  }

  recuperMestaches(pTache: Tache) {
    if (pTache.idUtilisateur == null) {
      return false;
    }

    return pTache.dateCloture == null && pTache.idUtilisateur === this.idCurrentUser;
  }
  
  /**
   * Les tâches qui sont affectées à l'utilisateur courant seront misent en corbeille
   */
  userCorbeille() {    
    if ( this.groupeService.corbeilleUser(this.idCurrentUser)) {
      this.toastr.success('Vos taches ont été misent à la corbeille');
    }else {
      this.toastr.warning('Votre liste de tache est vide');
    }
  }

  permission(role: string) {
    if (role === ProfilCode.SUPERVISEUR.toString() || role === ProfilCode.DIRECTEUR.toString()) {
      return true
    }
    else {
      return false
    }
  }

}



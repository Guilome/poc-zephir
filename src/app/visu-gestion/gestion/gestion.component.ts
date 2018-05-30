import {AfterViewInit, Component, Inject, Input, OnInit} from '@angular/core';
import {TacheService} from '../../shared/services/tache.service';
import { Tache } from '../../shared/domain/Tache';
import {NoteService} from '../../shared/services/note.service';
import {Router} from '@angular/router';
import {Chart} from 'chart.js';
import {GroupeService} from '../../shared/services/groupe.service';
import {Code, Groupe} from '../../shared/domain/groupe';
import {ToastrService} from 'ngx-toastr';
import { Utilisateur, Profil } from '../../shared/domain/Utilisateur';
import { UtilisateurService } from '../../shared/services/utilisateur.service';
import { ActionMetierService } from '../../shared/services/action-metier.service';
import { ContratService } from '../../shared/services/contrat.service';
import { Contrat } from '../../shared/domain/contrat';

@Component({
  selector: 'app-gestion',
  templateUrl: './gestion.component.html',
  styleUrls: ['./gestion.component.css']
})
export class GestionComponent implements OnInit, AfterViewInit {

  @Input() titre: string;
  @Input() card: string;
  @Input() profil: Profil;  
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
  contratBoolean = false

  // Liste :
  taches: Tache[];
  groupes: Groupe[];
  actionMetiers: Tache[];
  contrats: Contrat[]
  // map groupe key/value
  dataGroupe: Map<string, number>;

  // Current Utilisateur :
  idCurrentUser;

  utilisateur:Utilisateur 

  context: any;
  public c: Chart;
  private colors = [
    'grey',
    'cyan',
    'red',
    'blue',
    'green',
    'Purple',
    'yellow'
  ];
  // Contructor :
  constructor(public tacheService: TacheService,
              public noteService: NoteService,
              private router: Router,
              private groupeService: GroupeService,
              private toastr: ToastrService,
              private utilService: UtilisateurService,
              private actionMetierService: ActionMetierService,
              public contratService: ContratService) {

  }


  ngOnInit() {
    this.idCurrentUser = parseInt(localStorage.getItem('USER'));

    if (this.titre === 'Actions métier') {
      this.mesActionsMetier();
      this.actionMetiers =this.actionMetierService.listActionMetier;
      this.actionMetier = true;
      this.numId = 2;
    } else if (this.titre === 'Mes groupes') {
      this.utilisateur = this.utilService.getUserById(this.idCurrentUser)
      this.profil = this.utilisateur.profil
      this.groupes = this.groupeService.getAll()
      this.groupes = this.groupes.filter(f => f.utilisateurs.includes(this.utilisateur)) 
      this.groupeBoolean = true;
      this.numId = 3;
    } else if (this.titre === 'Mes Notes') {
      this.mesNotes();
      this.numId = 4;
      this.noteBoolean = true;
      // récupération des données :
      this.noteService.listerNotes().subscribe(data => this.taches = data);
    } else if (this.titre === 'Dossier pièce justificative') {
      this.contratBoolean = true;        
      this.contrats = this.contratService.getContratByIdUtilisateur(this.idCurrentUser)     
      } else {
      this.numId = Math.floor(Math.random() * (999999 - 100000)) + 100000;
    }
  }

  ngAfterViewInit() {
    if (this.groupeBoolean) {
      this.context = document.getElementById('chart');
      this.mesGroupes();
    }
  }

  voirNoteTerminer(dateCloture: any): boolean {
    if ( dateCloture != null) {
      return this.boolDateCloture;
    }
    return true;
  }
  visualiser(eye) {
    // TACHES
    if (this.tacheBoolean) {
      alert('Hello ! ' + this.titre);
    }
    // NOTES
    else if (this.noteBoolean) {

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
    if(this.tacheBoolean) {
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

  private mesTaches() {
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

  mesGroupes() {
    this.groupeService.getAffectationTaches(Code.VERIFICATION).subscribe(data => {
      this.dataGroupe = data;
    });
  }
  
  /**
   * Dispatche les tache non affectées aux gestionnaires de manière équitable
   */
  dispatcher() {
    this.groupeService.dispatcher(Code.VERIFICATION);
  }

  /**
   * Tout remettre dans la courbeille
   * aucune taches ne sera affectée à un gestionnaire
   */
  corbeille() {
    this.groupeService.corbeille(Code.VERIFICATION);
  }

  /**
   * Les tâches qui sont affectées à l'utilisateur courant seront misent en corbeille
   */
  userCorbeille() {
    if ( this.groupeService.corbeilleUser() ) {
      this.toastr.success('Vos taches ont été misent à la corbeille');
    }
  }

  permission(role: string) {
    if (role === Profil.SUPERVISEUR.toString() || role === Profil.DIRECTEUR.toString()) {
      return true
    }
    else {
      return false
    }
  }

}



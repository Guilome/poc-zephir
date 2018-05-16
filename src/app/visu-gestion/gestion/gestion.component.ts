import {AfterViewInit, Component, Inject, Input, OnInit} from '@angular/core';
import {TacheService} from '../../shared/services/tache.service';
import { Tache } from '../../shared/domain/Tache';
import {NoteService} from '../../shared/services/note.service';
import {Router} from '@angular/router';
import {Chart} from 'chart.js';
import {GroupeService} from '../../shared/services/groupe.service';

@Component({
  selector: 'app-gestion',
  templateUrl: './gestion.component.html',
  styleUrls: ['./gestion.component.css']
})
export class GestionComponent implements OnInit, AfterViewInit {

  @Input() titre: string;
  @Input() card: string;

  eye = false;
  search = false;
  share = false;
  inbox = false;
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
  // Liste :
  taches: Tache[];

  // Current User :
  idCurrentUser = 1;

  // Contructor :
  constructor(public tacheService: TacheService, public noteService: NoteService, private router: Router, private groupeService: GroupeService) {

  }


  ngOnInit() {
    if (this.titre === 'Mes tâches') {
        this.mesTaches();
        this.tacheBoolean = true;
        this.tacheService.listerTaches().subscribe(data => this.taches = data);
        this.numId = 1;
    } else if (this.titre === 'Mes devis à valider') {
        this.mesDevis();
      this.numId = 2;
    } else if (this.titre === 'Mes groupes') {
        this.groupeBoolean = true;
        this.numId = 3;
    } else if (this.titre === 'Mes Notes') {
      this.mesNotes();
      this.numId = 4;
      this.noteBoolean = true;
      // récupération des données :
      this.noteService.listerNotes().subscribe(data => this.taches = data);


    } else {
      this.numId = Math.floor(Math.random() * (999999 - 100000)) + 100000;
    }



  }

  ngAfterViewInit() {
    if (this.groupeBoolean){
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
    if (this.tacheBoolean) {
      alert('Hello ! ' + this.titre);
    }
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

    this.search = true;
    this.inbox = true;
    this.calendar = true;
    this.file = true;
    this.filter = true;
    this.chart = true;
    this.refresh = true;
  }

  private mesDevis() {
    this.eye = true;
    this.search = true;
    this.inbox = true;
    this.file = true;
    this.filter = true;
    this.refresh = true;
  }

  private mesNotes() {
    this.eye = true;
    this.search = true;
    this.inbox = true;
    this.file = true;
    this.filter = true;
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
    const data = new Map<string, number>();
    for (const t of this.tacheService.listTaches) {
      if (t.idUtilisateur != null) {
        const key = 'Gestionnaire ' + t.idUtilisateur;
        const sum = data.get(key);
        data.set(key,  sum == null ? 1 : sum + 1 );

      } else {
        const sum = data.get('Non Affectées');
        data.set('Non Affectées' , sum == null ? 1 : sum + 1);
      }
    }
    const colors = [
      'cyan',
      'red',
      'blue',
      'green',
      'Purple',
      'yellow',
      'grey'
    ]
    const ctx = document.getElementById('chart');
    if (ctx != null) {
      const chart = new Chart(ctx, {
        type: 'pie',
        data: {
          labels: Array.from(data.keys()),
          datasets: [{
            data: Array.from(data.values()),
            backgroundColor: colors
          }]
        }
        ,
        options: {
          title: {
            display: true,
            text: 'Groupe Vérification'
          }
        }
      });
    }
  }
}



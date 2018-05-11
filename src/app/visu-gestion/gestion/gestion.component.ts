import {Component, Input, OnInit} from '@angular/core';
import {debug, log} from 'util';
import {TacheService} from '../../shared/services/tache.service';
import { Tache } from '../../shared/domain/Tache';
import {NoteService} from '../../shared/services/note.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-gestion',
  templateUrl: './gestion.component.html',
  styleUrls: ['./gestion.component.css']
})
export class GestionComponent implements OnInit {

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
  numId = 0;

  voirNoteFermee = false;
  // Boolean :
  tacheBoolean = false;
  noteBoolean = false;
  // Liste :
  taches: Tache[];
  // Contructor :
  constructor(public tacheService: TacheService, public noteService: NoteService, private router: Router) {
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
    } else if (this.titre === 'Mes Notes') {
      this.mesNotes();
      this.numId = 3;
      this.noteBoolean = true;
      // récupération des données :
      this.noteService.listerNotes().subscribe(data => this.taches = data);


    } else {
      this.numId = Math.floor(Math.random() * (999999 - 100000)) + 100000;
      console.log(this.numId);
    }

  }
  xorPersonalise(b: boolean): boolean {
    if ( this.voirNoteFermee) {
      return true;
    }
    return b;
  }
  visualiser(eye) {
    if (this.tacheBoolean) {
      alert('Hello ! ' + this.titre);
    }
    if (this.noteBoolean) {

      this.voirNoteFermee = !this.voirNoteFermee;
      if( this.voirNoteFermee ) {
        eye.classList.add('del');
      } else {
        eye.classList.remove('del');
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
  fermerNote(idNote, tr: any) {
    this.noteService.fermer(idNote);
    document.getElementById(tr).classList.add('del');


  }
  ouvrirNote(idNote, tr: any) {

    this.noteService.reOuvrir(idNote);
    document.getElementById(tr).classList.remove('del');

  }

  private mesTaches() {
    this.eye = true;
    this.search = true;
    this.share = true;
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



}



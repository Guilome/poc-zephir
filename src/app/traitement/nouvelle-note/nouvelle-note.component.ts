import { Component, OnInit } from '@angular/core';
import {NgForm} from '@angular/forms';
import {Nature, Tache} from '../../shared/domain/Tache';
import {Context} from '../../shared/domain/context';
import {NoteService} from '../../shared/services/note.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-nouvelle-note',
  templateUrl: './nouvelle-note.component.html',
  styleUrls: ['./nouvelle-note.component.css']
})
export class NouvelleNoteComponent implements OnInit {

  currentDate = new Date();
  mapCode = [
            ['NOTE', 'Note'],
            ['NOTE_INTERNE', 'Note Interne']
    ];

  defaultCode = this.mapCode[0][0]; // 'CODE'
  choixGroupe = this.mapCode[1][0];

  groupes = ['Avenant'];
  defaultGroupe = this.groupes[0].toUpperCase();

  constructor(private noteService: NoteService, private router: Router) { }

  ngOnInit() {

  }

  onSubmit(form: NgForm, msg: any) {
    console.log( form.value['message']); // undefined

    this.noteService.addNote(form.value['code'], form.value['groupe'], msg.value, form.value['dateLimite']);
    this.router.navigate(['/gestionBO']);
  }
}

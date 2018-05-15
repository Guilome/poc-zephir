import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Observable} from 'rxjs/Observable';
import {Nature, Status, Tache} from '../domain/Tache';

@Injectable()
export class NoteService {

  constructor() { }

  noteSubject: BehaviorSubject<Tache[]> = new BehaviorSubject([]);
  private notes: Tache[] = [];

  listerNotes(): Observable<Tache[]> {
    let taille = 0;
    this.noteSubject.subscribe(data =>  taille = data.length );

    if ( taille < 1) {
      const note1 = new Tache(Nature.NOTE);
      note1.ident = 10;
      note1.code = 'NOTE';
      note1.message = 'Rappeler M. MOLINARO JACQUES pour lui proposer de changer de formule de garanties sur son contrat habitation';
      note1.dateLimite = new Date('08/05/2018');

      const note2 = new Tache(Nature.NOTE);
      note2.ident = 11;
      note2.code =  'NOTE_INTERNE';
      note2.message = 'Ne plus souscrire de devis SOLUTIO à effet 2020 partir du 01/12/2019';
      note2.dateLimite = new Date('12/05/2018');



      this.notes = [note1, note2];
      this.noteSubject.next(this.notes);
    }
    return this.noteSubject.asObservable();

  }

  addNote(code, groupe, message, dateLimite) {

    const note = new Tache(Nature.NOTE);
    note.code = code;
    note.idGroupe = this.getIdGroupe(groupe);
    note.message = message;
    note.dateLimite = dateLimite;
    this.notes.push(note);
    // abonnement :
    this.noteSubject.next(this.notes);
  }

  /**
   * return l'ID du groupe entré en parametre
   * @param groupe
   * @returns {number}
   */
  private getIdGroupe(groupe): number {
    return 1;
  }

  fermer(idNote) {
    const note = this.notes.find(n =>  n.ident === idNote);
    note.status = Status.OK;
    note.dateCloture = new Date(); // date du jour + heure
  }
  reOuvrir(idNote) {
    const note = this.notes.find(n => n.ident === idNote);
    note.status = Status.EN_ATTENTE;
    note.dateCloture = null; // date du jour + heure
  }

  getNoteById(idNote: number): Tache {
    return this.notes.find(n => n.ident === idNote);
  }

  removeNote(idNote: number) {
    this.notes = this.notes.filter(n => n.ident !== idNote);
    this.noteSubject.next(this.notes);
  }
}

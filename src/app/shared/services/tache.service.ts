import {Injectable} from '@angular/core';
import {Nature, Status, Tache, Priorite} from '../domain/Tache';
import {Context} from '../domain/context';
import { Subject, BehaviorSubject, Observable } from 'rxjs';

//
// AVENANT = Avenant
// RESIL = Résiliation

@Injectable()
export class TacheService {


  constructor() {
    let length = 0;
    this.tacheSubject.subscribe(data =>  length = data.length );
    if( length < 1) {
      const tache1 = new Tache(Nature.PIECE);
      tache1.ident = 1;
      tache1.context = new Context(1, 'S14053911', 'ASSELINE JEAN', 'GO ASSUR');
      tache1.status = Status.A_VERIFIER;
      tache1.code = 'ATT_PERMIS';
      tache1.priorite = Priorite.CINQ;
      tache1.dateLimite = new Date('12/05/2018');
      tache1.urlDocument = 'http://www.orimi.com/pdf-test.pdf';

      const tache3 = new Tache(Nature.PIECE);
      tache3.ident = 3;
      tache3.context = new Context(3, 'SD600003', 'ASSAPO SERGE4', 'CAP');
      tache3.status = Status.A_VALIDER;
      tache3.code = 'ATT_CG';
      tache3.priorite = Priorite.CINQ;
      tache3.dateLimite = new Date('05/05/2018');
      tache3.urlDocument = 'http://unec.edu.az/application/uploads/2014/12/pdf-sample.pdf';

      const tache2 = new Tache(Nature.TACHE);
      tache2.ident = 2;
      tache2.context = new Context(2, 'SD600002', 'ASSEMAIAN WILLIAM', 'LISE MONIQUE');
      tache2.status = Status.EN_ATTENTE;
      tache2.code = 'AVENANT';
      tache2.priorite = Priorite.CINQ;
      tache2.dateLimite = new Date('02/05/2018');
      tache2.urlDocument = 'https://s1.q4cdn.com/806093406/files/doc_downloads/test.pdf';

      this.listTaches = [tache1, tache2, tache3].sort((obj1, obj2) => {return obj1.ident - obj2.ident;} );
      this.tacheSubject.next(this.listTaches);

    }
  }
  listTaches: Tache[] = [];
  // données en mémoire
  tacheSubject: BehaviorSubject<Tache[]> = new BehaviorSubject([])

  listerTaches(): Observable<Tache[]> {

    return this.tacheSubject.asObservable() ;
  }

  addTache(tache: Tache) {
    tache.ident = this.listTaches[(this.listTaches.length - 1)].ident + 1;
    this.listTaches.push(tache);
    this.tacheSubject.next(this.listTaches);


  }

  getTacheById(id: number) {
    return this.listTaches.find(t => t.ident === id);
  }

  setDateCloture(idTache: number) {
    this.getTacheById(idTache).dateCloture = new Date();
  }

  /*
    Passer le status de "A_VERIFIER" à "A_VALIDER"
   */
  updateStatus(idTache: number){
    this.getTacheById(idTache).status = Status.A_VALIDER;
  }

  closeTacheNonConforme(idTache: number, motif: string) {
    this.getTacheById(idTache).message = motif;
    this.setDateCloture(idTache);
  }
  nextId(idTache: number): number {
    const i  = this.listTaches.findIndex(t => t.ident === idTache);
    const nextTache = this.getTacheFromInex(i + 1)
    if ( nextTache != null) {
      return nextTache.ident;
    } else {
      return null;
    }
  }

  getTacheFromInex(index: number): Tache {
    return this.listTaches.find( (t, i) => i === index );
  }
}


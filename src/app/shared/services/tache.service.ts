import {Injectable} from '@angular/core';
import {Nature, Status, Tache, Priorite} from '../domain/Tache';
import {Context} from '../domain/context';
import { Subject, BehaviorSubject } from 'rxjs';
import { Observable } from 'rxjs';

//
// AVENANT = Avenant
// RESIL = Résiliation

@Injectable()
export class TacheService {


  constructor() {}
  listTaches: Tache[] = [];
  // données en mémoire
  tacheSubject: BehaviorSubject<Tache[]> = new BehaviorSubject([])
  
  listerTaches(): Observable<Tache[]> {
    let length = 0;
    this.tacheSubject.subscribe(data =>  length = data.length );
    if( length < 1){
    // //// ////  ////// ///// ///if(this.listerTaches.length < 1 ) {
      const tache1 = new Tache(Nature.PIECE);
      tache1.ident = 1;
      tache1.context = new Context(1, 'S14053911', 'ASSELINE JEAN', 'GO ASSUR');
      tache1.status = Status.OK;
      tache1.code = 'ATT_PERMIS';
      tache1.libelle = 'Permis de conduire';
      tache1.priorite = Priorite.CINQ;
      tache1.dateLimite = new Date('12/05/2018');

      const tache3 = new Tache(Nature.PIECE);
      tache3.ident = 3;
      tache3.context = new Context(3, 'SD600003', 'ASSAPO SERGE4', 'CAP');
      tache3.status = Status.A_VALIDER;
      tache3.code = 'ATT_CG';
      tache3.libelle = 'Carte grise';
      tache3.priorite = Priorite.CINQ;
      tache3.dateLimite = new Date('05/05/2018');

      const tache2 = new Tache(Nature.TACHE);
      tache2.ident = 2;
      tache2.context = new Context(2, 'SD600002', 'ASSEMAIAN WILLIAM', 'LISE MONIQUE');
      tache2.status = Status.EN_ATTENTE;
      tache2.code = 'AVENANT';
      tache2.libelle = 'Avenant';
      tache2.priorite = Priorite.CINQ;
      tache2.dateLimite = new Date('02/05/2018');

      this.listTaches = [tache1, tache2, tache3];
      console.log('Lister tache dans le IF: ' + this.listTaches.length);
      this.tacheSubject.next(this.listTaches)
      
    }
    console.log('Lister tache : ' + this.listTaches.length);
    return this.tacheSubject.asObservable() ;
  }

  addTache(tache: Tache) {
    tache.ident = this.listTaches[(this.listTaches.length - 1)].ident + 1;
    this.listTaches.push(tache);
    this.tacheSubject.subscribe(data => console.log('1) Add tache : ' + data.length))
    this.tacheSubject.next(this.listTaches);
    this.tacheSubject.subscribe(data => console.log('2) Add tache : ' + data.length))
    
    
  }

  getTacheById(id: number) {
    return this.listTaches.find(t => t.ident === id);
  }
}
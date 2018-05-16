import {Injectable} from '@angular/core';
import {Nature, Status, Tache, Priorite} from '../domain/Tache';
import {Context} from '../domain/context';
import { Subject, BehaviorSubject, Observable } from 'rxjs';

//
// AVENANT = Avenant
// RESIL = Résiliation

@Injectable()
export class TacheService {

  public currentGestionnaire = 1;


  constructor() {
    let length = 0;
    this.tacheSubject.subscribe(data => length = data.length);
    if (length < 1) {

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
      tache3.status = Status.A_VERIFIER;
      tache3.code = 'ATT_CG';
      tache3.priorite = Priorite.CINQ;
      tache3.dateLimite = new Date('05/05/2018');
      tache3.urlDocument = 'http://unec.edu.az/application/uploads/2014/12/pdf-sample.pdf';

      const tache2 = new Tache(Nature.TACHE);
      tache2.ident = 2;
      tache2.context = new Context(2, 'SD600002', 'ASSEMAIAN WILLIAM', 'LISE MONIQUE');
      tache2.status = Status.A_VERIFIER;
      tache2.code = 'AVENANT';
      tache2.priorite = Priorite.CINQ;
      tache2.dateLimite = new Date('02/05/2018');
      tache2.urlDocument = 'https://s1.q4cdn.com/806093406/files/doc_downloads/test.pdf';

      this.listTaches = [tache1, tache2, tache3].sort((obj1, obj2) => obj1.ident - obj2.ident);
      this.tacheSubject.next(this.listTaches);

      this.create17Taches();
    }
  }

  listTaches: Tache[] = [];
  // données en mémoire
  tacheSubject: BehaviorSubject<Tache[]> = new BehaviorSubject([]);

  listerTaches(): Observable<Tache[]> {

    return this.tacheSubject.asObservable();
  }

  addTache(tache: Tache) {
    tache.ident = this.listTaches[(this.listTaches.length - 1)].ident + 1;
    this.listTaches.push(tache);
    this.tacheSubject.next(this.listTaches);


  }

  getTacheById(id: number) {
    return this.listTaches.find(t => t.ident === id);
  }

  setDateCloture(idTache: number): Tache {
    this.getTacheById(idTache).dateCloture = new Date();
    return this.getTacheById(idTache);
  }

  /*
    Passer le status de "A_VERIFIER" à "A_VALIDER"
   */
  updateStatus(idTache: number) {
    this.getTacheById(idTache).status = Status.A_VALIDER;
  }

  closeTacheNonConforme(idTache: number, motif: string) {
    this.getTacheById(idTache).message = motif;
    this.setDateCloture(idTache);
  }

  nextId(idTache: number, idUser: number): number {
    const i = this.listTaches.findIndex(t => t.ident === idTache);
    const nextTache = this.getTacheFromInex(i + 1);
    if (nextTache != null && nextTache.idUtilisateur === idUser) {
      return nextTache.ident;
    } else {
      return null;
    }
  }

  getTacheFromInex(index: number): Tache {
    return this.listTaches.find((t, i) => i === index);
  }

  create17Taches() {
    // Gestionnaire ID :
    const gestionnaire2 = 2;
    const gestionnaire3 = 3;
    const gestionnaire4 = 4;

    for (let i = 0; i < 17; i++) {
      const lTache = new Tache(Nature.PIECE);
      lTache.ident = i + 4;
      lTache.context = new Context(i, 'SD60000' + i, 'ASSAPO SERGE' + i, 'CAP' + i);
      lTache.status = Status.A_VERIFIER;
      lTache.code = ['ATT_CG', 'ATT_PERMIS'][i % 2];
      lTache.priorite = Priorite.CINQ;
      lTache.dateLimite = new Date('05/05/2018');
      lTache.urlDocument = 'http://unec.edu.az/application/uploads/2014/12/pdf-sample.pdf';
      if (i < 4) { // 4 taches pour current user
        lTache.idUtilisateur = this.currentGestionnaire;
      } else if (i < 7) {
        lTache.idUtilisateur = gestionnaire2;
      } else if (i < 9) {
        lTache.idUtilisateur = gestionnaire3;
      } else if (i < 13) {
        lTache.idUtilisateur = gestionnaire4;
      }
      this.listTaches.push(lTache);
    }
  }
}


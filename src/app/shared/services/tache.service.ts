import {Injectable} from '@angular/core';
import {Nature, Status, Tache} from '../domain/Tache';
import {Context} from '../domain/context';
import { BehaviorSubject} from 'rxjs/BehaviorSubject';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import {GroupeService} from './groupe.service';
import {Code} from '../domain/groupe';
import {t} from '@angular/core/src/render3';

//
// AVENANT = Avenant
// RESIL = Résiliation

@Injectable()
export class TacheService {

  public currentGestionnaire = 1;
  public gestionnaires = [];

  constructor() {
    // Gestionnaire ID :
    const gestionnaire2 = 2;
    const gestionnaire3 = 3;
    const gestionnaire4 = 4;
    this.gestionnaires.push(this.currentGestionnaire);
    this.gestionnaires.push(gestionnaire2);
    this.gestionnaires.push(gestionnaire3);
    this.gestionnaires.push(gestionnaire4);
    let length = 0;
    this.tacheSubject.subscribe(data => length = data.length);
    if (length < 1) {

      const tache1 = new Tache(Nature.PIECE);
      tache1.ident = 1;
      tache1.context = new Context(1, 'S14053911', 'ASSELINE JEAN', 'GO ASSUR');
      tache1.status = Status.A_VERIFIER;
      tache1.idGroupe = 1;
      tache1.code = 'ATT_PERMIS';
      tache1.priorite = 5;
      tache1.dateLimite = new Date('12/05/2018');
      tache1.urlDocument = 'http://www.orimi.com/pdf-test.pdf';

      const tache3 = new Tache(Nature.PIECE);
      tache3.ident = 3;
      tache3.context = new Context(3, 'SD600003', 'ASSAPO SERGE4', 'CAP');
      tache3.status = Status.A_VERIFIER;
      tache3.idGroupe =  1;
      tache3.code = 'ATT_CG';
      tache3.priorite = 6;
      tache3.dateLimite = new Date('05/05/2018');
      tache3.urlDocument = 'http://unec.edu.az/application/uploads/2014/12/pdf-sample.pdf';

      const tache2 = new Tache(Nature.TACHE);
      tache2.ident = 2;
      tache2.context = new Context(2, 'SD600002', 'ASSEMAIAN WILLIAM', 'LISE MONIQUE');
      tache2.status = Status.A_VERIFIER;
      tache2.idGroupe = 1;
      tache2.code = 'AVENANT';
      tache2.priorite = 4;
      tache2.dateLimite = new Date('02/05/2018');
      tache2.urlDocument = 'https://s1.q4cdn.com/806093406/files/doc_downloads/test.pdf';

      this.listTaches = [tache1, tache2, tache3].sort((obj1, obj2) => obj1.priorite - obj2.priorite);
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

  /**
   * set la date de cloture et modifie le status en "OK"
   * @param {number} idTache
   * @returns {Tache}
   */
  setDateClotureAndStatus(idTache: number): Tache {
    this.getTacheById(idTache).status = Status.OK;
    return this.setDateCloture(idTache);
  }
  private setDateCloture(idTache: number): Tache {
    this.getTacheById(idTache).dateCloture = new Date();
    return this.getTacheById(idTache);
  }

  /**
   * Passer le status de "A_VERIFIER" à "A_VALIDER"
   * la pièce est affectée au groupe "Validation"
   * @param {number} idTache
   */
  updateStatusAndGroupe(idTache: number) {
    const tache = this.getTacheById(idTache);
    tache.status = Status.A_VALIDER;
    tache.idGroupe = 2; // groupe validation ident : 2
  }

  closeTacheNonConforme(idTache: number, motif: string) {
    this.getTacheById(idTache).message = motif;
    this.setDateCloture(idTache);
  }

  /**
   * renvoie l'id de la tache suivante en fonction de son status et de l'utilisateur
   * @param {number} idTache
   * @param {number} idUser
   * @returns {number}
   */
  nextId(idTache: number, idUser: number): number {

    const tache = this.getTacheById(idTache)
    const myTacheslist = this.listTaches.filter(t => t.idUtilisateur === idUser && t.status === tache.status).sort((obj1, obj2) => obj1.priorite - obj2.priorite);
    const nextIndex = (myTacheslist.findIndex( t => t.ident === idTache ) + 1) % myTacheslist.length;
    const nextTache = myTacheslist.find(( t, i) => i === nextIndex );
    if (nextTache != null) {
      return nextTache.ident;
    } else {
      return null;
    }
  }

  create17Taches() {
    for (let i = 0; i < 17; i++) {
      const lTache = new Tache(Nature.PIECE);
      lTache.ident = i + 4;
      lTache.context = new Context(i, 'SD60000' + i, 'ASSAPO SERGE' + i, 'CAP' + i);
      lTache.status = Status.A_VERIFIER;
      lTache.idGroupe = 1;
      lTache.code = ['ATT_CG', 'ATT_PERMIS'][i % 2];
      lTache.priorite = 5;
      lTache.dateLimite = new Date('05/05/2018');
      lTache.urlDocument = 'http://unec.edu.az/application/uploads/2014/12/pdf-sample.pdf';
      if (i < 4) { // 4 taches pour current user
        lTache.idUtilisateur = this.currentGestionnaire;
      } else if (i < 7) {
        lTache.idUtilisateur = this.gestionnaires[1];
      } else if (i < 9) {
        lTache.idUtilisateur = this.gestionnaires[2];
      } else if (i < 13) {
        lTache.idUtilisateur = this.gestionnaires[3];
      }
      this.listTaches.push(lTache);
    }
  }

  getGestionnaires(): any {
    return this.gestionnaires;
  }
  public dispatcher(codeGroupe: Code) {
    this.listTaches.filter(tt => tt.idUtilisateur == null)
      .forEach( ( tache , i) => {
      tache.idUtilisateur = this.gestionnaires[i % this.gestionnaires.length];
    });
    this.tacheSubject.next(this.listTaches);
  }

  public courbeille(codeGroupe: Code) {
    this.listTaches.forEach(tache => tache.idUtilisateur = null);
    this.tacheSubject.next(this.listTaches);

  }

  }


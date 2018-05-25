import {Injectable} from '@angular/core';
import {Nature, Status, Tache} from '../domain/Tache';
import {Context} from '../domain/context';
import { BehaviorSubject} from 'rxjs/BehaviorSubject';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import {GroupeService} from './groupe.service';
import {Code} from '../domain/groupe';
import {t} from '@angular/core/src/render3';
import {UtilisateurService} from './utilisateur.service';
import { Contrat } from '../domain/contrat';
import { Utilisateur } from '../domain/Utilisateur';

//
// AVENANT = Avenant
// RESIL = Résiliation

@Injectable()
export class TacheService {

  constructor(private UtilisaturService: UtilisateurService) {

    let length = 0;
    this.tacheSubject.subscribe(data => length = data.length);
    if (length < 1) {

      const tache1 = new Tache(Nature.PIECE);
      tache1.ident = 1;
      tache1.context = new Context(1, 'ASSELINE JEAN', 'GO ASSUR', new Contrat(3,'TEST'));
      tache1.status = Status.A_VERIFIER;
      tache1.idGroupe = 1;
      tache1.code = 'ATT_PERMIS';
      tache1.priorite = 5;
      tache1.dateLimite = new Date('12/05/2018');
      tache1.urlDocument = 'assets/pdf/PDC.pdf';
      tache1.idUtilisateur = 1;

      const tache3 = new Tache(Nature.PIECE);
      tache3.ident = 3;
      tache3.context = new Context(3, 'ASSAPO SERGE4', 'CAP', new Contrat(2,'TEST'));
      tache3.status = Status.A_VERIFIER;
      tache3.idGroupe =  1;
      tache3.code = 'ATT_CG';
      tache3.priorite = 6;
      tache3.dateLimite = new Date('05/05/2018');
      tache3.urlDocument = 'assets/pdf/CG.pdf';
      tache3.idUtilisateur = 1;

      const tache2 = new Tache(Nature.TACHE);
      tache2.ident = 2;
      tache2.context = new Context(2, 'ASSEMAIAN WILLIAM', 'LISE MONIQUE', new Contrat(1,'TEST'));
      tache2.status = Status.A_VERIFIER;
      tache2.idGroupe = 1;
      tache2.code = 'ATT_RI';
      tache2.priorite = 4;
      tache2.dateLimite = new Date('02/05/2018');
      tache2.urlDocument = 'assets/pdf/RI.pdf';
      tache2.idUtilisateur = 1;

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
      lTache.context = new Context(i, 'ASSAPO SERGE' + i, 'CAP' + i, new Contrat(1,'TEST'));
      lTache.status = Status.A_VERIFIER;
      lTache.idGroupe = 1;
      lTache.code = ['ATT_CG', 'ATT_PERMIS', 'ATT_RI'][i % 3];
      lTache.priorite = 5;
      lTache.dateLimite = new Date('05/05/2018');
      lTache.urlDocument = 'https://www.cartegrise.com/pdf/generic/1/mandat_immatriculation_professionnel.pdf';
      if (i < 4) { // 4 taches pour current user
        lTache.idUtilisateur = this.UtilisaturService.getUserById(1).ident;
      } else if (i < 7) {
        lTache.idUtilisateur = this.UtilisaturService.getUserById(2).ident;
      } else if (i < 9) {
        lTache.idUtilisateur = this.UtilisaturService.getUserById(3).ident;
      } else if (i < 13) {
        lTache.idUtilisateur = this.UtilisaturService.getUserById(4).ident;
      }
      this.listTaches.push(lTache);
    }
  }

  public dispatcher(codeGroupe: Code) {
    const tailleGestionnaires =  this.UtilisaturService.getAll().length;
    this.listTaches.filter(tt => tt.idUtilisateur == null)
      .forEach( ( tache , i) => {
      tache.idUtilisateur = this.UtilisaturService.getUserByIndex(i % tailleGestionnaires).ident;
      });
    this.tacheSubject.next(this.listTaches);
  }

  public dispatcherGestionnaire(utilisateurs: Utilisateur[], taches: Tache[]){
    const tailleGestionnaires =  utilisateurs.length;
    taches.forEach( ( tache , i) => {
      tache.idUtilisateur = utilisateurs[i % tailleGestionnaires].ident;
    });
  }

  public corbeille(codeGroupe: Code) {
    this.listTaches.forEach(tache => tache.idUtilisateur = null);
    this.tacheSubject.next(this.listTaches);

  }

  public corbeilleUser(): boolean {
    const userId = parseInt(localStorage.getItem('USER'), 10);
    if(userId != null) {
      this.listTaches.filter(tache => tache.idUtilisateur === userId).forEach(tache => tache.idUtilisateur = null);
      this.tacheSubject.next(this.listTaches);
      return true;
    }
    console.log('Utilisateur non connecté');
    return false;
  }

  }


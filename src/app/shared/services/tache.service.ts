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
import { Utilisateur, Profil } from '../domain/Utilisateur';

//
// AVENANT = Avenant
// RESIL = Résiliation

@Injectable()
export class TacheService {

  constructor(private UtilisateurService: UtilisateurService) {

    let length = 0;
    this.tacheSubject.subscribe(data => length = data.length);
    if (length < 1) {
      this.create15Dossiers();
      this.create_100_DossiersClotures();
      this.tacheSubject.next(this.listTaches);
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

  getPieceById(id: number) {
    console.log('Service getpiece by id : ' + id);
    return this.listTaches.find(t => t.ident === id && t.nature == Nature.PIECE);
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
  closeTacheConforme(idTache: number){
    this.setDateCloture(idTache);
    this.getTacheById(idTache).status = Status.OK;
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

  private create_100_DossiersClotures(){
    for (let i = 500 ; i < 600 ; i++) {
        const lTache = new Tache(Nature.DOSSIER);
        lTache.ident = i;
        const c = new Contrat(65065+i,'SOLUTIO')
        c.numero = 'S140581'+ i;
        const context = new Context(999020+i, this.nomApl[i%this.nomApl.length], this.nomInter[i%this.nomInter.length], c);
        lTache.context = context;
        lTache.status = Status.A_VERIFIER;
        lTache.idGroupe = 1;
        lTache.priorite = 5;
        const date = '05/' + (i%31) + '/2018';
        lTache.dateCloture = new Date(date);
        const idUser = (i%4) + 1;
        lTache.idUtilisateur = this.UtilisateurService.getUserById(idUser).ident;
        lTache.status = Status.OK;
        this.listTaches.push(lTache);
    }
  }
  private create15Dossiers() {
    for (let i = 0; i < 15; i++) {
      const lTache = new Tache(Nature.DOSSIER);
      lTache.ident = 1000020+i;
      const c = new Contrat(7475065+i,'SOLUTIO')
      c.numero = 'S140581'+ i;
      const context = new Context(1000020+i, this.nomApl[i%this.nomApl.length], this.nomInter[i%this.nomInter.length], c);
      lTache.context = context;
      lTache.status = Status.A_VERIFIER;
      lTache.idGroupe = 1;
      lTache.priorite = 5;
      lTache.dateLimite = new Date('06/15/2018');
      if (i < 4) { // 4 taches pour current user
        lTache.idUtilisateur = this.UtilisateurService.getUserById(1).ident;
      } else if (i < 7) {
        lTache.idUtilisateur = this.UtilisateurService.getUserById(2).ident;
      } else if (i < 9) {
        lTache.idUtilisateur = this.UtilisateurService.getUserById(3).ident;
      } else if (i < 13) {
        lTache.idUtilisateur = this.UtilisateurService.getUserById(4).ident;
      }
      // 3 dissers non affectés 
      this.listTaches.push(lTache);
      this.create3Pieces(lTache);
    }
  }
  private create3Pieces(dossier_199: Tache) {
    for (let i = 0; i < 3; i++) {
      const lPiece = new Tache(Nature.PIECE);
      lPiece.status = Status.A_VERIFIER;      
      lPiece.ident = this.listTaches.length + 20000 ;
      lPiece.idTacheMere = dossier_199.ident;
      lPiece.code = ['ATT_CG', 'ATT_PERMIS', 'ATT_RI'][i];
      lPiece.priorite = [5, 3, 6][i];
      lPiece.urlDocument = ['assets/pdf/CG.pdf','assets/pdf/PDC.pdf','assets/pdf/RI.pdf'][i];
      lPiece.context = dossier_199.context;
      this.listTaches.push(lPiece);
    }
  }
  private nomInter = [
            'ROUQUETTE FREDERIC'
            ,'ROUQUETTE FREDERIC'
            ,'IQBAL ZAFAR'
            ,'IQBAL ZAFAR'
            ,'IQBAL ZAFAR'
            ,'FOSTER MALCOLM'
            ,'FOSTER MALCOLM'
            ,'FOSTER MALCOLM'
            ,'CETANI MARIO'
            ,'CETANI MARIO'
            ,'CETANI MARIO'
            ,'SCHONDORF DANIEL'
            ,'SCHONDORF DANIEL'
            ,'SCHONDORF DANIEL'
            ,'LAMBERT PIERRETTE'
            ,'LAMBERT PIERRETTE'
            ,'LAMBERT PIERRETTE'
  ]
  private nomApl = [
          'BOYER ET MORVILLIERS',
          'BOYER ET MORVILLIERS',
          'LEADER ASSURANCES',
          'LEADER ASSURANCES',
          'FAAC',
          'FAAC',
          'FAAC',
          'PEREIRE DIRECT',
          'PEREIRE DIRECT',
          'PEREIRE DIRECT',
          'APM ASSURANCES',
          'APM ASSURANCES',
          'APM ASSURANCES',
          'ASSUR INVEST',
          'ASSUR INVEST',
          'ASSUR INVEST',
          'H/ZEPHIR ASSURANCES'
  ]
  public dispatcher(codeGroupe: Code) {
    const tailleGestionnaires =  this.UtilisateurService.getAll().filter(u => u.profil != Profil.DIRECTEUR).length;
    this.listTaches.filter(tt => tt.idUtilisateur == null)
      .forEach( ( tache , i) => {
      tache.idUtilisateur = this.UtilisateurService.getUserByIndex(i % tailleGestionnaires).ident;
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

  public getPiecesByContext(context: Context): Tache[]{
    return this.listTaches.filter(piece => piece.context == context)
  }

  public getPiecesByIdContext(idContext: number): Tache[]{
    return this.listTaches.filter(piece => piece.context.ident == idContext && piece.nature == Nature.PIECE)
  }

  }


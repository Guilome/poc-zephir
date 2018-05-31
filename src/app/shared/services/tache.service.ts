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

    return this.tacheSubject;
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
    return this.listTaches.find(t => t.ident === id && t.nature == Nature.PIECE);
  }

  /**
   * set la date de cloture et modifie le status en "OK"
   * @param {number} idTache
   * @returns {Tache}
   */
  closePieceConforme(idTache: number): Tache {
    const p = this.getPieceById(idTache);
    p.status = Status.OK;
    p.dateCloture  = new Date();
    return p;
  }
  /**
   * le status reste "à vérifier"
   * si le status est "à valider" => il revient sur "à vérifier"
   * @param idTache 
   */
  closePieceNonConforme(idTache: number, motif: string) {
    const p = this.getTacheById(idTache);
    p.message = motif;
    p.status = Status.A_VERIFIER;
    p.dateCloture = new Date();
  }
  /*private setDateCloture(idTache: number): Tache {
    this.getTacheById(idTache).dateCloture = new Date();
    return this.getTacheById(idTache);
  }*/

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

  /**
   * 
   * @param idTache 
   * @param motif 
   */
  closeTacheNonConforme(idTache: number, motif: string): Tache {
    const p = this.getTacheById(idTache);
    p.message = motif;
    p.dateCloture = new Date();

    return p;
  }
  /**
   * Fermeture de la Piece après validation 
   * @param idTache 
   */
  closeTacheConforme(idTache: number){
    const tache = this.getPieceById(idTache);
    tache.status = Status.OK;
    tache.dateCloture = new Date();
    console.log(this.getTacheById(idTache).status)
  }

  /**
   * renvoie l'id de la tache suivante en fonction de son status et de l'utilisateur
   * @param {number} idTache
   * @param {number} idUser
   * @returns {number}
   */
  /*nextId(idTache: number, idUser: number): number {

    const tache = this.getTacheById(idTache)
    const myTacheslist = this.listTaches.filter(t => t.idUtilisateur === idUser && t.status === tache.status).sort((obj1, obj2) => obj1.priorite - obj2.priorite);
    const nextIndex = (myTacheslist.findIndex( t => t.ident === idTache ) + 1) % myTacheslist.length;
    const nextTache = myTacheslist.find(( t, i) => i === nextIndex );
    if (nextTache != null) {
      return nextTache.ident;
    } else {
      return null;
    }
  }*/

  private create_100_DossiersClotures(){
    for (let i = 500 ; i < 600 ; i++) {
        const lTache = new Tache(Nature.DOSSIER);
        lTache.ident = i;
        const c = new Contrat(450020+i,'SOLUTIO')
        c.numero = 'S140510'+ i;
        lTache.context = new Context(330010+i, this.nomApl[i%this.nomApl.length], this.nomInter[i%this.nomInter.length], c);;
        lTache.status = Status.A_VERIFIER;
        lTache.idGroupe = 1;
        lTache.priorite = 5;
        lTache.code = "199_AFN";
        const date = '05/' + ((i%31) + 1) + '/2018';
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
      const c = new Contrat(740001+i,'SOLUTIO');
      c.numero = 'S140581'+ i;
      const context = 
      lTache.context = new Context(100020+i, this.nomApl[i%this.nomApl.length], this.nomInter[i%this.nomInter.length], c);
      lTache.status = Status.A_VERIFIER;
      lTache.idGroupe = 1;
      lTache.priorite = 5;
      lTache.code = "199_AFN";
      lTache.dateLimite = new Date('06/15/2018');
      lTache.dateCreation = new Date();
      lTache.idUtilisateur = null;

      this.listTaches.push(lTache);
      this.create3Pieces(lTache);
    }
  }
  private create3Pieces(dossier_199: Tache) {
    for (let i = 0; i < 3; i++) {
      const lPiece = new Tache(Nature.PIECE);
      lPiece.status = Status.A_VERIFIER;      
      lPiece.ident = this.listTaches.length + 70000 ;
      lPiece.idTacheMere = dossier_199.ident;
      lPiece.code = ['ATT_CG', 'ATT_PERMIS', 'ATT_RI'][i];
      lPiece.priorite = [5, 3, 6][i];
      lPiece.urlDocument = ['assets/pdf/CG.pdf','assets/pdf/PDC.pdf','assets/pdf/RI.pdf'][i];
      lPiece.context = dossier_199.context;
      lPiece.dateLimite = dossier_199.dateLimite
      lPiece.dateCreation = new Date();
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
    this.listTaches.filter(tt => tt.idUtilisateur == null && tt.dateCloture == null && tt.nature == Nature.DOSSIER)
      .forEach( ( tache , i) => {
      tache.idUtilisateur = this.UtilisateurService.getUserByIndex(i % tailleGestionnaires).ident;
      });
    this.tacheSubject.next(this.listTaches);
  }

  public dispatcherGestionnaire(utilisateurs: Utilisateur[], taches: Tache[]){
    const tailleGestionnaires =  utilisateurs.length;
    taches.filter(tache => tache.dateCloture == null && tache.nature == Nature.DOSSIER).forEach( ( tache , i) => {
      tache.idUtilisateur = utilisateurs[i % tailleGestionnaires].ident;
    });
  }

  public corbeille(codeGroupe: Code) {
    this.listTaches.filter(tache => tache.dateCloture == null && tache.nature == Nature.DOSSIER).forEach(tache => tache.idUtilisateur = null);
    this.tacheSubject.next(this.listTaches);
  }

  public corbeilleUser(): boolean {
    const userId = parseInt(localStorage.getItem('USER'), 10);
    if(userId != null) {
      this.listTaches.filter(tache => tache.idUtilisateur === userId && tache.dateCloture == null && tache.nature == Nature.DOSSIER).forEach(tache => tache.idUtilisateur = null);
      this.tacheSubject.next(this.listTaches);
      return true;
    }
    return false;
  }


  public getPiecesByContext(context: Context): Tache[]{
    return this.listTaches.filter(piece => piece.context == context && piece.nature == Nature.PIECE)
  }

  public getPiecesByIdContext(idContext: number): Tache[]{
    return this.listTaches.filter(piece => piece.context.ident == idContext && piece.nature == Nature.PIECE)
  }

  }


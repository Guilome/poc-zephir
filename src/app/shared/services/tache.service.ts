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

  /** Permet l'ajout d'une liste a tacheSubject
   * 
   * @param list 
   */
  nextListSubject(list: any){
    this.tacheSubject.next(list)
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

  getPiecesByDossier(idDossier: number){
    return this.listTaches.filter(t => t.nature == Nature.PIECE && t.idTacheMere === idDossier)
  }

  getDossierById(id: number) {
    return this.listTaches.find(t => t.ident === id && t.nature == Nature.DOSSIER);
  }

  /**
   * set la date de cloture de vérification et set l'id de l'utilisateur vérificateur
   * @param {number} idTache
   * @returns {Tache}
   */
  closePieceConforme(idTache: number): Tache {
    const p = this.getPieceById(idTache);
    p.dateVerification  = new Date();
    p.idUtilisateurVerification = p.idUtilisateur;
    
    return p;
  }
  /**
   * le status reste "à vérifier"
   * Ajout de la date de vérification et de cloture
   * @param idTache 
   */
  closePieceNonConforme(idTache: number, motifNonConformite: string) {
    const p = this.getTacheById(idTache);
    p.motifNonConformite = motifNonConformite;
    p.dateCloture = new Date();
    p.dateVerification = p.dateCloture;
  }


  /**
   * Passer le status de "A_VERIFIER" à "A_VALIDER"
   * la pièce est affectée au groupe "Validation"
   * la date de vérification est affecté à la date et heure du jour.
   * l'id Utilisateur est affecté à l'utilisateur de vérification.
   * @param {number} idTache
   */
  toEtapeValidation(idTache: number) {
    const tache = this.getTacheById(idTache);
    //appel web service pour récupérer l'id du groupe validati on
    tache.idGroupe = 2;
    tache.dateVerification = new Date();
    tache.idUtilisateurVerification = tache.idUtilisateur;

    tache.idUtilisateur = null;


  }

  /**
   * 
   * @param idTache 
   * @param motif 
   */
  closeTacheNonConforme(idTache: number, motif: string): Tache {
    const p = this.getTacheById(idTache);
    p.motifNonConformite = motif;
    p.dateCloture = new Date();

    return p;
  }
  /**
   * Fermeture de la Piece après validation 
   * @param idTache 
   */
  closeTacheConforme(idTache: number){
    const tache = this.getPieceById(idTache);
    tache.idUtilisateurCloture = tache.idUtilisateur;
    tache.dateCloture = new Date();
  }

  /**
   * Fermeture du dossier
   */
  closeDossier(idDossier: number){
    let dossier = this.getDossierById(idDossier)
    dossier.dateCloture = new Date()
  }
  
  private create_100_DossiersClotures(){
    for (let i = 500 ; i < 600 ; i++) {
        const lTache = new Tache(Nature.DOSSIER);
        lTache.ident = i;
        const c = new Contrat(450020+i,'SOLUTIO')
        c.numero = 'S140510'+ i;
        lTache.context = new Context(330010+i, this.nomApl[i%this.nomApl.length], this.nomInter[i%this.nomInter.length], c);
        lTache.priorite = (i%10) + 1;
        lTache.code = "199_AFN";
        const date = '05/' + ((i%31) + 1) + '/2018';
        lTache.dateCloture = new Date(date);
        lTache.dateVerification  = new Date('05/21/2018');
        lTache.dateCreation  = new Date('05/01/2018');
        lTache.dateReception = new Date('05/01/2018');
        const idUser = ((Math.floor(Math.random() * (999999 - 100000)) + 100000) % 6 ) + 1;
        
        lTache.idUtilisateurVerification = [1, 4, 6][i % 3];
        lTache.idUtilisateurCloture = [2, 3, 5][i % 3];
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
      lPiece.ident = this.listTaches.length + 70000 ;
      lPiece.idTacheMere = dossier_199.ident;
      lPiece.code = ['ATT_CG', 'ATT_PERMIS', 'ATT_RI'][i];
      lPiece.priorite = [5, 3, 6][i];
      lPiece.urlDocument = ['assets/pdf/CG.pdf','assets/pdf/PDC.pdf','assets/pdf/RI.pdf'][i];
      lPiece.context = dossier_199.context;
      lPiece.dateLimite = dossier_199.dateLimite
      lPiece.dateCreation = new Date();
      lPiece.dateReception = new Date();
      
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

  public getPiecesByContext(context: Context): Tache[]{
    return this.listTaches.filter(piece => piece.context == context && piece.nature == Nature.PIECE)
  }

  public getPiecesByIdContext(idContext: number): Tache[]{
    return this.listTaches.filter(piece => piece.context.ident == idContext && piece.nature == Nature.PIECE)
  }

  public getDossierByIdContext(idContext: number, userId: number): Tache{
    return this.listTaches.find(dossier => dossier.context.ident == idContext && dossier.nature == Nature.DOSSIER && dossier.idUtilisateur == userId)
  }

  public getDossierTermine(){
    return this.listTaches.filter( t => t.nature === Nature.DOSSIER && t.dateCloture != null)
  }

  public getDossierEncours(){
    return this.listTaches.filter( t => t.nature === Nature.DOSSIER && t.dateCloture == null)
  }

  public getDossierTermineByUser(idUtilisateur: number){
    return this.listTaches.filter( t => t.idUtilisateur == idUtilisateur && t.nature === Nature.DOSSIER && t.dateCloture != null)
  }

  public getDossierEnCoursByUser(idUtilisateur: number){
    return this.listTaches.filter( t => t.idUtilisateur == idUtilisateur && t.nature === Nature.DOSSIER && t.dateCloture == null)
  }

  public getStatutDossier(idDossier: number): Status{
    let lesPieces = this.getPiecesByDossier(idDossier)
    if (lesPieces.length == 0) {
      return Status.EN_ATTENTE
    } 
    else {
      if(lesPieces.filter(piece => piece.status == Status.A_VERIFIER).length > 0) {
        return Status.A_VERIFIER
      }
      else if(lesPieces.filter(piece => piece.status == Status.A_VALIDER).length == 3) {
        return Status.A_VALIDER
      }
      else if(lesPieces.filter(piece => piece.status == Status.OK).length == 3) {
        return Status.OK
      }
      else if(lesPieces.filter(piece => piece.status == Status.A_VERIFIER).length == 0 && 
              lesPieces.filter(piece => piece.status == Status.A_VALIDER).length > 0 && 
              lesPieces.filter(piece => piece.status == Status.OK).length < 3) {
        return Status.A_VALIDER
      }
    }
  }
}


import {Injectable} from '@angular/core';
import {Nature, Status, Tache} from '../domain/Tache';
import { BehaviorSubject} from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { Utilisateur } from '../domain/Utilisateur';
import { Groupe } from '../domain/Groupe';
import { UtilisateurService } from './utilisateur.service';


@Injectable()
export class TacheService {

  constructor(public utilisateurService: UtilisateurService) {}

  private listTaches: Tache[] = [];
  // données en mémoire
  private tacheSubject: BehaviorSubject<Tache[]> = new BehaviorSubject([]);
  public listPieceEnAttente: Tache[] = []; 
  public actionMetierTemporaire: Tache

  
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

  public getAll(): Tache[]{
    return this.listTaches;
  }

  getTacheById(id: number): Tache {
    return this.listTaches.find(t => t.ident === id);
  }

  /**
   * retourne un dossier (199) en fonction de son ID
   * @param id 
   */
  getDossierById(id: number): Tache {
    return this.listTaches.find(t => t.ident === id && t.nature == Nature.DOSSIER);
  }

  /**
   * Retourne la liste de pièces en fonction de l'ID du dossier (199), trié par priorité.
   * @param idDossier 
   */
  getPiecesByDossier(idDossier: number): Tache[]{
    return this.listTaches.filter(t => t.nature == Nature.PIECE && t.idTacheMere === idDossier).sort(this.trieByPriorite)
  }

  /**
   * Retourne la liste de note en fonction de l'ID du dossier (199)
   * @param idDossier 
   */
  getNotesByDossier(idDossier: number): Tache[]{
    return this.listTaches.filter(t => t.nature == Nature.NOTE && t.idTacheMere === idDossier)
  }
  
    /**
   * Retourne l'action métier qui est affectée à un dossier
   * @param idDossier 
   */
  getActionMetierByDossier(idDossier: number): Tache[]{
    return this.listTaches.filter(t => t.nature == Nature.TACHE && t.idTacheMere === idDossier);
  }

  getDossierByIdContext(idContext: number, userId: number): Tache{
    return this.listTaches.find(dossier => dossier.context.ident == idContext && dossier.nature == Nature.DOSSIER && dossier.utilisateur.ident == userId)
  }

  getTacheTermine(){
    return this.listTaches.filter( t => t.dateCloture != null)
  }

  getTacheEncours(){
    return this.listTaches.filter( t => t.dateCloture == null)
  }
  
  /**
   * Appel web service
   */
  public confirmerAjoutActionMetier() {
    this.actionMetierTemporaire = null;
  }

  ajoutTache(tache: Tache) {
    /* Appel Web Service */
    this.listTaches.push(tache);
    this.tacheSubject.next(this.listTaches);
  }

 
  /**
   * set la date de cloture de vérification et set l'id de l'utilisateur vérificateur
   * @param {number} idTache
   * @returns {Tache}
   */
  closePieceConforme(idTache: number): Tache {
    const p = this.getTacheById(idTache);
    p.dateVerification  = new Date();
    p.utilisateurVerification = p.utilisateur;
    
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
    p.utilisateurVerification = p.utilisateur;
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
    //appel web service pour récupérer l'id du groupe validation
    tache.dateVerification = new Date();
    tache.utilisateurVerification = tache.utilisateur;
    tache.utilisateur = null;
  }

  setUtilisateurNull(tache: Tache){
    tache.utilisateur = null
  }
  
  /**
   * Fermeture du dossier
   */
  closeDossier(idDossier: number){
    let dossier = this.getDossierById(idDossier)
    dossier.dateCloture = new Date();
    // fermer toutes les pieces...
    for ( let p of  this.getPiecesByDossier(idDossier) ) {
      p.dateCloture = new Date();
    }
  }
  
  createPiece(code: string, dossier: Tache) : Tache {
    // Appel Web service pour la génération de de l'identifiant
    const lPiece =  new Tache(Nature.PIECE);
    lPiece.codeTache = code;
    lPiece.dateCreation = new Date();
    // l'ident sera généré automatiquement via le serveur 
    lPiece.ident =  Math.floor(Math.random() * (999999 - 100000));
    lPiece.idTacheMere = dossier.ident;
    lPiece.context = dossier.context;
    lPiece.dateLimite = dossier.dateLimite
    lPiece.dateCreation = new Date();
    lPiece.priorite = 3;
    this.listTaches.push(lPiece);

    this.tacheSubject.next(this.listTaches);
    return lPiece;
  }

  /**
   *  Aucun appel web service
   * les pièces créée seront stocké tomporairement 
   * Si l'user valide le dossier ses pièces seront validées
   * La pièce est optionnel 
   * @param code 
   * @param dossier 
   * @param nature 
   * @param piece 
   */
  public createTacheTemporaire(code: string, dossier: Tache, nature: Nature , piece?: Tache) {
    const lPiece =  new Tache(nature);
    lPiece.codeTache = code;
    lPiece.dateCreation = new Date();
    lPiece.ident =  Math.floor(Math.random() * (999999 - 100000));
    lPiece.idTacheMere = dossier.ident;
    lPiece.context = dossier.context;
    lPiece.dateLimite = dossier.dateLimite
    lPiece.dateCreation = new Date();
    lPiece.priorite = 3;
    this.listPieceEnAttente.push(lPiece);
    if (piece != null) {
      this.listPieceEnAttente.push(piece);
    }
    this.listTaches.push(lPiece);
    this.tacheSubject.next(this.listTaches);
  }

  /**
   * Permet de supprimer la liste des pièces stocké tomporairement
   * Permet aussi d'annuler les modif effectuées sur une pièce
   * le bool sert à voir si on annule les modif effectuié sur une DMD d'AVT
   */
  public removeTacheTemporaire(bool?: boolean) {
    if (bool) {
      if( this.actionMetierTemporaire != null) {
        this.listTaches.splice(this.listTaches.indexOf(this.actionMetierTemporaire), 1)
        this.actionMetierTemporaire = null;
      }

    }else {
        for (let pi of this.listPieceEnAttente) {
          if(pi.motifNonConformite != null){
            this.getTacheById(pi.ident).motifNonConformite = null;
            this.getTacheById(pi.ident).dateCloture = null;
            
          }else {
            this.listTaches.splice(this.listTaches.indexOf(pi), 1)
          }
        }
      }
    this.tacheSubject.next(this.listTaches);
    this.listPieceEnAttente = [];
  }

  /**
   * Cas de la vérification : les pièces ajoutées seront conservées
   * ( aucun moyen d'annuler )
   */
  viderTacheTemporaire() {
    this.listPieceEnAttente = [];
  }
  /**
   * Permet d'ajouter la liste des pieces en attente 
   * Appel web service à faire
   */
  addTacheEnAttente(dossier: Tache) {
    for (const piece of this.listPieceEnAttente){
      // les pieces existe déjà dans la list du service 
      // appel web service 
    }
    this.listPieceEnAttente = [];
    dossier.utilisateur = null;
    dossier.dateVerification = null;
  }


  private trieByPriorite = (p1,p2) => {
    if ( p1.priorite == p2.priorite )
        return 0;
    else if  (p1.priorite < p2.priorite) 
        return -1;
      else
    return 1;
  }

  /**
   * "en attente" si aucune pièce est reçu.
   * "à vérifier" si une/plusieurs pîèce est à vérifiée.
   * "à valider" si toute les pièce sont à valider. 
   * 
   * @param idDossier 
   */
  public getStatutTache(tache: Tache): string{
    //Dossier
    if (tache.nature === Nature.DOSSIER){
      let lesPieces = this.getPiecesByDossier(tache.ident).filter(pi => pi.dateCloture == null);
      const mapCount = new Map<string,number>();
      mapCount.set(Status.EN_ATTENTE, 0);
      mapCount.set(Status.A_VERIFIER, 0);
      mapCount.set(Status.A_VALIDER, 0);
      const nbPiecesNonCloturees = lesPieces.length;
      if ( nbPiecesNonCloturees == 0) {
        return Status.OK// pour le jeu de test sinon le dossier est en attente
      }  else {
            for (let p of lesPieces) {
              mapCount.set(p.status, mapCount.get(p.status)+1);
            }
            if(mapCount.get(Status.A_VERIFIER) > 0 )
                return Status.A_VERIFIER
            else if (mapCount.get(Status.A_VALIDER) == nbPiecesNonCloturees )
                return Status.A_VALIDER;
            else if( mapCount.get(Status.EN_ATTENTE)  > 0)
                return Status.EN_ATTENTE;
      }
      return Status.OK 
    }
    // PIECE
    else {
      return tache.status;
    }
  }      


  public createNote(tacheMere: Tache, message: string) {
    const lNote = new Tache(Nature.NOTE);
    lNote.ident = Math.floor(Math.random() * (999999 - 100000));
    lNote.idTacheMere = tacheMere.ident;
    lNote.message = message;
    lNote.context = tacheMere.context;
    lNote.dateCreation = new Date();
    lNote.utilisateur = tacheMere.utilisateur;
    
    this.listTaches.push(lNote);
    this.tacheSubject.next(this.listTaches);
  }

  demandeNouvellePiece(piece: Tache) {
    const lPiece = new Tache(Nature.PIECE);
    lPiece.codeTache = piece.codeTache;
    lPiece.dateCreation = new Date();
    lPiece.ident =  Math.floor(Math.random() * (999999 - 100000));
    lPiece.idTacheMere = piece.idTacheMere;
    lPiece.context = piece.context;
    lPiece.dateLimite = piece.dateLimite
    lPiece.dateCreation = new Date();
    lPiece.priorite = 3;
    this.listTaches.push(lPiece);
    this.tacheSubject.next(this.listTaches);
  }

  isPiece(idTache: number): boolean {
    const lPiece = this.getTacheById(idTache);
    if ( lPiece != null)
      return lPiece.nature === Nature.PIECE;
    return false;
  }

  /**
   *  Méthode qui modifie l'utilisateur d'une tâche 
   * @param tache 
   * @param utilisateur 
   */
  public affecterTacheUtilisateur(tache: Tache, utilisateur: Utilisateur){
    tache.utilisateur = utilisateur
    if(tache.nature = Nature.DOSSIER){
      this.getPiecesByDossier(tache.ident).forEach(piece => piece.utilisateur = tache.utilisateur)
    }
  }
  /**
   * Méthode qui change une tâche à un groupe 
   * @param tache 
   * @param groupe 
   */
  public affecterTacheGroupe(tache: Tache, groupe: Groupe){
    tache.groupe = groupe;
  }
}


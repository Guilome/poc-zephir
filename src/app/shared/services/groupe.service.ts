import { Injectable } from '@angular/core';
import {Groupe, Code} from '../domain/groupe';
import {TacheService} from './tache.service';
import {Tache, Nature, Status} from '../domain/Tache';
import {BehaviorSubject} from '../../../../node_modules/rxjs';
import { UtilisateurService } from './utilisateur.service';
import { Utilisateur } from '../domain/Utilisateur';
import { ProfilCode } from '../domain/Profil';

@Injectable()
export class GroupeService {

  // données en mémoire
  mapEnCours: BehaviorSubject<Map<string, number>> = new BehaviorSubject(new Map());

  groupes = []
  taches = []
  tachesEnCours = []
  utilisateurs = []

  constructor(private tacheService: TacheService, private utilisateurService: UtilisateurService) {
      
    this.groupes.push(new Groupe(1, Code.AFN));
    this.groupes.push(new Groupe(2, Code.AVN));
    this.groupes.push(new Groupe(3, Code.REF));
    this.groupes.push(new Groupe(4, Code.RES));

  }

  getAll(): Groupe[] {
    return this.groupes;
  }

  public getGroupeById(ident: number): Groupe {
    return this.groupes.find(groupe => groupe.ident === ident)
  }

  getTacheEnCoursByGroupe(idGroupe: number, filtre: string): BehaviorSubject<Map<string, number>>{
    this.tacheService.listerTaches().subscribe(data => this.tachesEnCours = data.filter(t => t.idGroupe == idGroupe));    
    this.tachesEnCours = this.tachesEnCours.filter(t => this.tacheService.getStatutTache(t) != Status.OK ||
                                                        this.tacheService.getStatutTache(t) != Status.NON_CONFORME &&
                                                        t.nature != Nature.PIECE)
    switch(filtre){
      case "gestionnaire" :
        this.refreshMapEnCoursByUtilisateur(idGroupe);
        break;
      case "statut" :
        this.refreshMapEnCoursByStatut();
        break;
      case "produit" :
        this.refreshMapEnCoursByProduit();
        break;
    }
    return this.mapEnCours
  }

  private refreshMapEnCoursByUtilisateur(idGroupe: number) {
    const map = new Map<string, number>();
    map.set('Non Affectées', 0);
    this.utilisateurs = this.getUtilisateurByGroupe(idGroupe).filter(g => g.profil.code != ProfilCode.DIRECTEUR)    
    this.utilisateurs.forEach(g => map.set( g.nom+' '+g.prenom, 0))
    for (const t of this.tachesEnCours) {
      if (t.idUtilisateur != null && this.utilisateurs.find(u => u.ident == t.idUtilisateur)) {
        let gestionnaire = this.utilisateurService.getUserById(t.idUtilisateur)
        map.set(gestionnaire.nom+' '+gestionnaire.prenom,  (map.get(gestionnaire.nom+' '+gestionnaire.prenom)) + 1);
      } else {
        map.set('Non Affectées', (map.get('Non Affectées')) + 1);
      }
    }
    this.mapEnCours.next(map)
  }

  private refreshMapEnCoursByStatut() {
    const map = new Map<string, number>();
    // liste des statuts : Initialisation 
    let statuts: string[] = []
    statuts.push(Status.EN_ATTENTE);
    statuts.push(Status.A_VERIFIER);
    statuts.push(Status.A_VALIDER);
    statuts.forEach(s => map.set(s ,0))
    for (const t of this.tachesEnCours) {  
      map.set(this.tacheService.getStatutTache(t) , (map.get(this.tacheService.getStatutTache(t)))+1);
    }
    this.mapEnCours.next(map)
  }

  private refreshMapEnCoursByProduit() {
    const map = new Map<string, number>();
    // liste des produits : Initialisation
    let produits = this.tachesEnCours.filter(t => t.context.contrat.codeProduit)
    produits.forEach(p => map.set(p.context.contrat.codeProduit ,0))
    for (const t of this.tachesEnCours) {
      map.set(t.context.contrat.codeProduit,  (map.get(t.context.contrat.codeProduit) + 1));      
    }
    this.mapEnCours.next(map)
  }

  /**
   * return l'id du groupe en fonction du code entré en paramétre
   * @param {Code} code
   * @returns {number}
   */
  public getIdGroupeByCode(code: Code): number {
    return this.groupes.find(g => g.code === code).ident;
  }

  public dispatcher(idGroupe: number) {
    let list;
    this.tacheService.listerTaches().subscribe(t => list = t)
    list.filter(t => t.idGroupe == idGroupe).forEach( ( tache , i) => {
      const tailleGestionnaires =  this.getUtilisateurByGroupe(idGroupe)
          .filter(u => u.profil.code != ProfilCode.DIRECTEUR && this.getGroupesUtilisateur(u.ident).find(g => g.ident == tache.idGroupe)).length;
      if (tailleGestionnaires > 0 && this.tacheService.getStatutTache(tache) == Status.A_VALIDER && 
          this.getUtilisateurByGroupe(idGroupe)[i % tailleGestionnaires].validation == true) {
        tache.idUtilisateur = this.getUtilisateurByGroupe(idGroupe)[i % tailleGestionnaires].ident
        this.tacheService.getTachesByDossier(tache.ident).forEach(p => p.idUtilisateur = tache.idUtilisateur)
      }
      else if (tailleGestionnaires > 0 && this.tacheService.getStatutTache(tache) == Status.A_VERIFIER && 
               this.getUtilisateurByGroupe(idGroupe)[i % tailleGestionnaires].verification == true) {
        tache.idUtilisateur = this.getUtilisateurByGroupe(idGroupe)[i % tailleGestionnaires].ident
        this.tacheService.getTachesByDossier(tache.ident).forEach(p => p.idUtilisateur = tache.idUtilisateur)
      }
      else if (tailleGestionnaires > 0 && this.tacheService.getStatutTache(tache) == Status.NON_CONFORME && 
               this.getUtilisateurByGroupe(idGroupe)[i % tailleGestionnaires].avenant == true) {
        tache.idUtilisateur = this.getUtilisateurByGroupe(idGroupe)[i % tailleGestionnaires].ident
        this.tacheService.getTachesByDossier(tache.ident).forEach(p => p.idUtilisateur = tache.idUtilisateur)
      }
    });
    this.tacheService.nextListSubject(list);
    this.getTacheEnCoursByGroupe(idGroupe, "gestionnaire");
  }

  public dispatcherGestionnaire(utilisateurs: Utilisateur[], taches: Tache[]){
    //const tailleGestionnaires =  utilisateurs.length;
    taches.forEach( ( tache , i) => {
      const tailleGestionnaires =  utilisateurs.filter(u => this.getGroupesUtilisateur(u.ident).find(g => g.ident == tache.idGroupe)).length;
      
      if (this.tacheService.getStatutTache(tache) == Status.A_VALIDER && utilisateurs[i % tailleGestionnaires].validation == true) {
        tache.idUtilisateur = utilisateurs[i % tailleGestionnaires].ident;
        this.tacheService.getTachesByDossier(tache.ident).forEach(p => p.idUtilisateur = tache.idUtilisateur)
      }
      else if (this.tacheService.getStatutTache(tache) == Status.A_VERIFIER && utilisateurs[i % tailleGestionnaires].verification == true) {
        tache.idUtilisateur = utilisateurs[i % tailleGestionnaires].ident;
        this.tacheService.getTachesByDossier(tache.ident).forEach(p => p.idUtilisateur = tache.idUtilisateur)
      }
      else if (this.tacheService.getStatutTache(tache) == Status.NON_CONFORME && utilisateurs[i % tailleGestionnaires].avenant == true) {
        tache.idUtilisateur = utilisateurs[i % tailleGestionnaires].ident;
        this.tacheService.getTachesByDossier(tache.ident).forEach(p => p.idUtilisateur = tache.idUtilisateur)
      }
    });
  }

  public corbeille(idGroupe: number) {  
    let list;
    this.tacheService.listerTaches().subscribe(t => list = t)
    list.filter(tache => tache.dateCloture == null).forEach(tache => tache.idUtilisateur = null);
    this.tacheService.nextListSubject(list);
    this.getTacheEnCoursByGroupe(idGroupe, "gestionnaire");
  }

  public corbeilleUser(idUser: number): boolean {
    let list;
    if(idUser != null) {
      this.tacheService.listerTaches().subscribe(t => list = t);
      if (list.filter(tache => tache.idUtilisateur === idUser).length == 0 ){
        return false;
      }
      list.filter(tache => tache.idUtilisateur === idUser).forEach(tache => tache.idUtilisateur = null);
      this.tacheService.nextListSubject(list);
      return true;
    }
    this.getGroupesUtilisateur(idUser).forEach(groupe => this.refreshMapEnCoursByUtilisateur(groupe.ident));
    return false;
  }

  public isVerification(idUser: number): boolean {
    const user = this.utilisateurService.getUserById(idUser);
    return user.verification;        
  }

  public isValidation(idUser: number): boolean {
    const user = this.utilisateurService.getUserById(idUser);
    return user.validation;
  }
  
  /** Recupère la liste des utilisateurs dont l'id du groupe est passé en paramètre
   * 
   * @param idGroupe 
   */
  public getUtilisateurByGroupe(idGroupe: number): Utilisateur[]{
    return this.utilisateurService.getAll().filter(utilisateur => this.getGroupesUtilisateur(utilisateur.ident).find(groupe => groupe.ident == idGroupe))
  }

  getGroupesUtilisateur(idUtilisateur: number) {
    let utilisateur = this.utilisateurService.getUserById(idUtilisateur);
    let listeBannette: Groupe[] = [];
    if (utilisateur.profil.AVN == true){
      listeBannette.push(this.getGroupeById(this.getIdGroupeByCode(Code.AVN)))
      if (utilisateur.profil.AFN == true){
        listeBannette.push(this.getGroupeById(this.getIdGroupeByCode(Code.AFN)))   
        if (utilisateur.profil.REF == true){
          listeBannette.push(this.getGroupeById(this.getIdGroupeByCode(Code.REF)))
          if (utilisateur.profil.RES == true){
            listeBannette.push(this.getGroupeById(this.getIdGroupeByCode(Code.RES)))
          }
        }
        else if (utilisateur.profil.RES == true){
          listeBannette.push(this.getGroupeById(this.getIdGroupeByCode(Code.RES)))
        }
      }
      else if (utilisateur.profil.REF == true){
        listeBannette.push(this.getGroupeById(this.getIdGroupeByCode(Code.REF)))
        if (utilisateur.profil.RES == true){
          listeBannette.push(this.getGroupeById(this.getIdGroupeByCode(Code.RES)))
        }
      }
      else if (utilisateur.profil.RES == true){
        listeBannette.push(this.getGroupeById(this.getIdGroupeByCode(Code.RES)))
      }
    } 
    else if (utilisateur.profil.AFN == true){
      listeBannette.push(this.getGroupeById(this.getIdGroupeByCode(Code.AFN)))   
      if (utilisateur.profil.REF == true){
        listeBannette.push(this.getGroupeById(this.getIdGroupeByCode(Code.REF)))
        if (utilisateur.profil.RES == true){
          listeBannette.push(this.getGroupeById(this.getIdGroupeByCode(Code.RES)))
        }
      }
      else if (utilisateur.profil.RES == true){
        listeBannette.push(this.getGroupeById(this.getIdGroupeByCode(Code.RES)))
      }
    }
    else if (utilisateur.profil.REF == true){
      listeBannette.push(this.getGroupeById(this.getIdGroupeByCode(Code.REF)))
      if (utilisateur.profil.RES == true){
        listeBannette.push(this.getGroupeById(this.getIdGroupeByCode(Code.RES)))
      }
    }
    else if (utilisateur.profil.RES == true){
      listeBannette.push(this.getGroupeById(this.getIdGroupeByCode(Code.RES)))
    }
    return listeBannette
  }
}

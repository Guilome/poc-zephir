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

  public getGroupeByCode(code :Code): Groupe {
    return this.groupes.find(groupe => groupe.code == code)
  }
  
  /**
   * Retourne une liste de taches de tache non cloturés pour le graphique
   * @param idGroupe 
   * @param filtre
   */
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

  /**
   * renvoie une map des utilisateurs du groupe passer en paramètre ainsi que des taches
   * @param idGroupe 
   */
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

  /**
   * renvoie une map du nombre de tâche par status pour un groupe
   */
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

  /**
   * renvoie une map du nombre de tâche par produits
   */
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

  /**
   * Distribue toute les tâches au sein d'un groupe a ses utilisateurs
   * @param idGroupe 
   */
  public dispatcher(idGroupe: number) {
    let list;
    this.tacheService.listerTaches().subscribe(t => list = t)
    list.filter(t => t.idGroupe == idGroupe).forEach( ( tache , i) => {
      const tailleGestionnaires =  this.getUtilisateurByGroupe(idGroupe)
          .filter(u => u.profil.code != ProfilCode.DIRECTEUR && u.profil.groupes.find( g => g == tache.idGroupe)).length;
          this.tacheService.affecterTacheUtilisateur(tache, this.getUtilisateurByGroupe(idGroupe)[i % tailleGestionnaires])
    });
    this.tacheService.nextListSubject(list);
    this.getTacheEnCoursByGroupe(idGroupe, "gestionnaire");
  }

  /**
   * Distribue les tâches séléctionnées aux utlisateurs séléctionnés
   * @param utilisateurs 
   * @param taches 
   */
  public dispatcherGestionnaire(utilisateurs: Utilisateur[], taches: Tache[]){
    taches.forEach( ( tache , i) => {
      const tailleGestionnaires =  utilisateurs.filter(u => u.profil.groupes.find( g => g == tache.idGroupe)).length;
      this.tacheService.affecterTacheUtilisateur(tache, utilisateurs[i % tailleGestionnaires])
    });
  }

  /**
   * désaffecte toutes les tâches d'un groupe
   * @param idGroupe 
   */
  public corbeille(idGroupe: number) {  
    let list;
    this.tacheService.listerTaches().subscribe(t => list = t)
    list.filter(tache => tache.dateCloture == null).forEach(tache => tache.idUtilisateur = null);
    this.tacheService.nextListSubject(list);
    this.getTacheEnCoursByGroupe(idGroupe, "gestionnaire");
  }

  /**
   * désaffecte toutes les tâches d'un utilisateur
   * @param idUser 
   */
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
    this.utilisateurService.getUserById(idUser).profil.groupes.forEach( g => this.refreshMapEnCoursByUtilisateur(g))
    return false;
  }

  /** Recupère la liste des utilisateurs dont l'id du groupe est passé en paramètre
   * 
   * @param idGroupe 
   */
  public getUtilisateurByGroupe(idGroupe: number): Utilisateur[]{
    return this.utilisateurService.getAll().filter(utilisateur => utilisateur.profil.groupes.find(g => g == idGroupe))
  }
}

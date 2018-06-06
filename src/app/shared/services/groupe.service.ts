import { Injectable } from '@angular/core';
import {Groupe, Code} from '../domain/groupe';
import {TacheService} from './tache.service';
import {Tache, Nature} from '../domain/Tache';
import {BehaviorSubject} from '../../../../node_modules/rxjs';
import { UtilisateurService } from './utilisateur.service';
import { Utilisateur, Profil } from '../domain/Utilisateur';
import { Contrat } from '../domain/contrat';

@Injectable()
export class GroupeService {

  // données en mémoire
  mapSubject: BehaviorSubject<Map<string, number>> = new BehaviorSubject(new Map());
  mapEnCours: BehaviorSubject<Map<string, number>> = new BehaviorSubject(new Map());

  groupes = []
  taches = []
  dossiersEnCours = []
  utilisateurs = []

  constructor(private tacheService: TacheService, private utilisateurService: UtilisateurService) {
      
    this.groupes.push(new Groupe(1, Code.VERIFICATION));
    this.groupes.push(new Groupe(2, Code.VALIDATION));
    this.groupes.push(new Groupe(3, Code.AVENANT));
    this.groupes.push(new Groupe(4, Code.SOUSCRIPTION));

  }

  getAll(): Groupe[] {
    return this.groupes;
  }

  public getGroupeById(ident: number): Groupe {
    return this.groupes.find(groupe => groupe.ident === ident)
  }

  getDossierEnCours(codeGroupe: Code): BehaviorSubject<Map<string, number>>{
    this.tacheService.listerTaches().subscribe(data => this.dossiersEnCours = data.filter(t => t.idGroupe == this.getIdGroupeByCode(codeGroupe)));
    this.dossiersEnCours = this.dossiersEnCours.filter(tache => tache.dateCloture == null && tache.nature == Nature.DOSSIER)
    this.refreshMapEnCours(this.getIdGroupeByCode(codeGroupe))
    return this.mapEnCours
  }

  private refreshMapEnCours(idGroupe: number) {
    const map = new Map<string, number>();
    // liste des gestionnaires : Initialisation
    map.set('Non Affectées', 0);
    let gestionnaires = this.getUtilisateurByGroupe(idGroupe).filter(g => g.profil != Profil.DIRECTEUR).forEach(g => map.set( g.nom+' '+g.prenom, 0))
    for (const t of this.dossiersEnCours) {
      if (t.idUtilisateur != null) {
        let gestionnaire = this.utilisateurService.getUserById(t.idUtilisateur)
        const key = gestionnaire.nom+' '+gestionnaire.prenom;
        const sum = map.get(key);
        map.set(key,  sum + 1);
      } else {
        const sum = map.get('Non Affectées');
        map.set('Non Affectées', sum + 1);
      }
    }
    this.mapEnCours.next(map)
  }

  /**
   * actualise la liste de taches en fonction du groupe donné en paramétre
   * @param {Code} codeGroupe
   */
  private refreshTaches(codeGroupe: Code) {
    this.tacheService.listerTaches().subscribe(data => this.taches = data.filter(t => t.idGroupe = this.getIdGroupeByCode(codeGroupe)));
  }

  /**
   * return l'id du groupe en fonction du code entré en paramétre
   * @param {Code} code
   * @returns {number}
   */
  public getIdGroupeByCode(code: Code): number {
    return this.groupes.find(g => g.code === code).ident;
  }

  public dispatcher(codeGroupe: Code) {
    this.tacheService.dispatcher(codeGroupe);
    this.getDossierEnCours(codeGroupe);
  }

  public corbeille(codeGroupe: Code) {
    this.tacheService.corbeille(codeGroupe);
    this.getDossierEnCours(codeGroupe);
  }

  public corbeilleUser(idGroupe: number): boolean {
    const ret = this.tacheService.corbeilleUser();
    this.refreshMapEnCours(idGroupe);
    return ret;
  }

  public isVerification(idUser: number): boolean {
    const idVerif = this.getIdGroupeByCode(Code.VERIFICATION);
    const user = this.utilisateurService.getUserById(idUser);
    return idVerif == user.idGroupe;
  }

  public isValidation(idUser: number): boolean {
    const idVerif = this.getIdGroupeByCode(Code.VALIDATION);
    const user = this.utilisateurService.getUserById(idUser);
    return idVerif == user.idGroupe;
  }
  
  /** Recupère la liste des utilisateurs dont l'id du groupe est passé en paramètre
   * 
   * @param idGroupe 
   */
  public getUtilisateurByGroupe(idGroupe: number){
    return this.utilisateurService.getAll().filter(utilisateur => utilisateur.idGroupe === idGroupe)
  }

}

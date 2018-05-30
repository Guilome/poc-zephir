import { Injectable } from '@angular/core';
import {Groupe, Code} from '../domain/groupe';
import {TacheService} from './tache.service';
import {Tache} from '../domain/Tache';
import {BehaviorSubject} from '../../../../node_modules/rxjs';
import { UtilisateurService } from './utilisateur.service';
import { Utilisateur, Profil } from '../domain/Utilisateur';
import { ContratService } from './contrat.service';
import { Contrat } from '../domain/contrat';

@Injectable()
export class GroupeService {

  // données en mémoire
  mapSubject: BehaviorSubject<Map<string, number>> = new BehaviorSubject(new Map());
  mapSubjectTermine: BehaviorSubject<Map<string, number>> = new BehaviorSubject(new Map());

  groupes = [];
  taches = [];
  tachesTermine = [];
  utilisateurs = []

  constructor(private tacheService: TacheService, private utilisateurService: UtilisateurService) {
    
    this.utilisateurs = utilisateurService.getAll().filter(u => u.profil != Profil.DIRECTEUR)
    
    this.groupes.push(new Groupe(1, Code.VERIFICATION, this.utilisateurs));
    this.groupes.push(new Groupe(2, Code.VALIDATION, []));
    this.groupes.push(new Groupe(3, Code.AVENANT, []));
    this.groupes.push(new Groupe(4, Code.SOUSCRIPTION, []));

  }

  getAll(): Groupe[] {
    return this.groupes;
  }

  public getGroupeById(ident: number): Groupe {
    return this.groupes.find(groupe => groupe.ident === ident)
  }

  getTacheTerminé(codeGroupe: Code): BehaviorSubject<Map<string, number>> {
    if (this.taches.length < 1) {
      this.refreshTaches(codeGroupe);
    }
    this.tachesTermine = this.taches.filter(tache => tache.dateCloture != null)
    
    this.refreshMap(this.taches);

    return this.mapSubjectTermine;
  }

  getAffectationTaches(codeGroupe: Code): BehaviorSubject<Map<string, number>> {
    if (this.taches.length < 1) {
      this.refreshTaches(codeGroupe);
    }
    this.refreshMap(this.taches);

    return this.mapSubject;
  }

  private refreshMap(lesTaches: Tache[]) {
    const map = new Map<string, number>();
    // liste des gestionnaires : Initialisation
    map.set('Non Affectées', 0);
    let gestionnaires = this.utilisateurService.getAll().filter(g => g.profil != Profil.DIRECTEUR).forEach(g => map.set( g.nom+' '+g.prenom, 0))
    for (const t of lesTaches) {
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
    this.mapSubject.next(map);
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
    this.refreshMap(this.taches);
  }

  public corbeille(codeGroupe: Code) {
    this.tacheService.corbeille(codeGroupe);
    this.refreshMap(this.taches);
  }

  public corbeilleUser(): boolean {
    const ret = this.tacheService.corbeilleUser();
    this.refreshMap(this.taches);
    return ret;
  }
}

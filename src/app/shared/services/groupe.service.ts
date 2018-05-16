import { Injectable } from '@angular/core';
import {Groupe, Code} from '../domain/groupe';
import {TacheService} from './tache.service';
import {Tache} from '../domain/Tache';
import {BehaviorSubject} from '../../../../node_modules/rxjs';

@Injectable()
export class GroupeService {

  // données en mémoire
  mapSubject: BehaviorSubject<Map<string, number>> = new BehaviorSubject(new Map());

  groupes = [];
  taches = [];

  constructor(private tacheService: TacheService) {
    const g1 = new Groupe(1, Code.VERIFICATION);
    const g2 = new Groupe(2, Code.VALIDATION);
    const g3 = new Groupe(3, Code.AVENANT);

    this.groupes.push(g1);
    this.groupes.push(g2);
    this.groupes.push(g3);

  }

  getAll(): Groupe[] {
    return this.groupes;
  }

  getAffectationTaches(codeGroupe: Code): BehaviorSubject<Map<string, number>> {
    if (this.taches.length < 1) {
      this.refreshTaches(codeGroupe);
    }
    const map = new Map<string, number>();
    for (const t of this.taches) {
      if (t.idUtilisateur != null) {
        const key = 'Gestionnaire ' + t.idUtilisateur;
        const sum = map.get(key);
        map.set(key, sum == null ? 1 : sum + 1);

      } else {
        const sum = map.get('Non Affectées');
        map.set('Non Affectées', sum == null ? 1 : sum + 1);
      }
    }
    this.mapSubject.next(map);
    return this.mapSubject;
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
    this.getAffectationTaches(codeGroupe);
  }

  public courbeille(codeGroupe: Code) {

  }
}

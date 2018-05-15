import { Injectable } from '@angular/core';
import {Groupe, Code} from '../domain/groupe';

@Injectable()
export class GroupeService {

  groupes = [];
  constructor() {
    const g1 = new Groupe(1, Code.VERIFICATION);
    const g2 = new Groupe(1, Code.VALIDATION);
    const g3 = new Groupe(1, Code.AVENANT);

    this.groupes.push(g1);
    this.groupes.push(g2);
    this.groupes.push(g3);

  }

  getAll(): Groupe[] {
    return this.groupes;
  }
}

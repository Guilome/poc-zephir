import {Injectable} from '@angular/core';
import {Nature, Status, Tache, Priorite} from '../domain/Tache';
import {Context} from '../domain/context';

@Injectable()
export class TacheService {

  constructor() {
  }

  listTaches(): Tache[] {

    const tache1 = new Tache(Nature.PIECE);
    tache1.context = new Context(1, 'S14053911', 'ASSELINE JEAN', 'GO ASSUR');
    tache1.status = Status.OK;
    tache1.code = 'ATT_PERMIS';
    tache1.libelle = 'Permis de conduire';
    tache1.priorite = Priorite.CINQ;
    tache1.dateLimite = new Date('12/05/2018');
    const tache3 = new Tache(Nature.PIECE);
    tache3.context = new Context( 3, 'SD600003', 'ASSAPO SERGE4', 'CAP');
    tache3.status = Status.A_VALIDER;
    tache3.code = 'ATT_CG';
    tache3.libelle = 'Carte grise';
    tache3.dateLimite = new Date('05/05/2018');

    const tache2 = new Tache(Nature.TACHE);
    tache2.context = new Context(2, 'SD600002', 'ASSEMAIAN WILLIAM', 'LISE MONIQUE');
    tache2.status = Status.EN_ATTENTE;
    tache2.code = 'AVT';
    tache2.libelle = 'Avenant';
    tache2.dateLimite = new Date('02/05/2018');



    return [tache1, tache2, tache3, tache1, tache2, tache3];
  }
}

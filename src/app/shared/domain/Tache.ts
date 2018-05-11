import {Context} from './context';


export class Tache {
  //
  static libCode = new Map()
    .set('ATT_CG', 'Carte grise')
    .set('ATT_PERMIS', 'Permis de conduire')
    .set('AVENANT', 'Avenant')
    .set('RESILILATION', 'Résiliation')
    .set('NOTE', 'Note')
    .set('NOTE_INTERNE', 'Note Interne');
  //
  constructor(public nature: Nature ) {
    this.status = Status.EN_ATTENTE;
    console.log(this.status);
  }
  // Private
  private _libelle: string;

  public ident: number;
  public code: string;
  public famille: string;
  public sousFamille: string;
  public message: string; // commentaire
  public priorite: Priorite;
  public dateLimite: Date;
  public status: Status;
  public urlDocument: string;
  public conformite: boolean;
  public motifNonConformite: string;
  public context: Context;

  idUtilisateur: number;
  idGroupe: number;

  get libelle(): string {
    return Tache.libCode.get(this.code);
  }

}


export enum Nature {
  TACHE = 'Tâche',
  PIECE = 'Piece',
  NOTE = 'Note',
  ALERTE = 'Alerte',
}
export enum Status {
  A_VERIFIER = 'À vérifier',
  A_VALIDER  = 'À valider',
  EN_ATTENTE = 'En attente',
  OK = 'Ok'
}


export enum Priorite {
  ZERO = 0,
  UN = 1,
  DEUX = 2,
  TROIS = 3,
  QUATRE = 4,
  CINQ = 5,
  SIX = 6,
  SEPT = 7,
  HUIT = 8,
  NEUF = 9,
  DIX = 10
}

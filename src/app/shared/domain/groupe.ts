export class Groupe {

  public libelle: string;

  constructor(public ident: number, public code: Code) {
    this.libelle = this.code.valueOf();
  }
}
export enum Code {
  AFN = 'Affaire nouvelle',
  AVN = 'Avenant',
  REF = 'Refus',
  RES = 'Résiliation'
}

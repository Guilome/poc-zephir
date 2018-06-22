export class Groupe {

  public libelle: string;

  constructor(public ident: number, public code: CodeGroupe) {
    this.libelle = this.code.valueOf();
  }
}
export enum CodeGroupe {
  AFN = 'Affaire nouvelle',
  AVT = 'Avenant',
  REF = 'Refus',
  RES = 'Résiliation'
}

export class Bannette {

  public libelle: string;

  constructor(public ident: number, public code: BannetteCode) {
    this.libelle = this.code.valueOf();
  }
}
export enum BannetteCode {
  AFN = 'Affaire nouvelle',
  AVN = 'Avenant',
  RES = 'Resiliation',
  REF = 'Refus'
}

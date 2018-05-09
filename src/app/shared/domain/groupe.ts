export class Groupe {

  public libelle: string;
  public ident: string;

  constructor(public code: Code) {
    this.libelle = this.code.valueOf();
  }
}
enum Code {
  VERIFICATION = 'Vérification des pièces justificatives',
  VALIDATION = 'Validation des pièces justificatives'
}

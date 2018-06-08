export class Modification {
    
  public ident: number;
  public donnee: string;

  constructor( public idTache: number, public code: Code, public valeurAvant: string, public valeurApres: string) {
    this.donnee = this.code.valueOf();
  }
}

export enum Code {
  CRM = 'Modification du CRM',
  CRM2 = 'Modification du deuxiéme CRM',
  DATE_PERMIS = 'Modification de la date du permis',
  MARQUE_VEHICULE = 'Modification de la marque du véhicule',
  MODELE_VEHICULE = 'Modification du modèle du véhicule'
}
  
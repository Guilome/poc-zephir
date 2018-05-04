export class Devis {

  static map = new Map()
    .set(1, 'Devis')
    .set(2, 'En cours')
    .set(3, 'Mis en demeure')
    .set(4, 'Suspendu')
    .set(5, 'Suspendu contentieux')
    .set(6, 'Résilié')
    .set(7, 'Résilié contentieux');



  public ident: number;
  public identDevisAvenant: number;
  public numContrat: string;
  public codeProduit: string;
  public nomAppelClient: string;
  public etatContrat: string;
  public dateCreation: Date; // format DD/MM/YYYY hh:mm
  public dateEffet: Date; // format DD/MM/YYYY
  public fractionnement: Fractionnement;
  public conditionAcceptation: string;

  constructor(public  nature: Nature) {
  }

}

enum Nature {
  DEV = 'Devis',
  DEV_AVT = 'Devis d\'avenant'
}

enum Fractionnement {
  M = 'Mensuel',
  T = 'Trimestriel',
  S = 'Semestriel',
  A = 'Annuel'
}



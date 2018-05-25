export class Contrat {

  static mapEtat = new Map()
    .set(0, 'Devis')
    .set(1, 'En cours')
    .set(2, 'Mis en demeure')
    .set(3, 'Suspendu')
    .set(4, 'Suspendu contentieux')
    .set(6, 'Résilié')
    .set(7, 'Résilié contentieux');

  public identDevisAvenant: number;
  public numero: string;
  
  public nomAppelClient: string;
  public nomAppelIntermediaire: string;
  public etatContrat: string;
  public dateCreation: Date; // format DD/MM/YYYY hh:mm
  public dateEffet: Date; // format DD/MM/YYYY
  public fractionnement: Fractionnement;
  public conditionAcceptation: string;

  constructor(public ident: number, public codeProduit: string) {
    this.etatContrat = Contrat.mapEtat.get(1);
  }

}

export enum NatureContrat {
  DEV = 'Devis',
  DEV_AVT = 'Devis d\'avenant'
}

export enum Fractionnement {
  M = 'Mensuel',
  T = 'Trimestriel',
  S = 'Semestriel',
  A = 'Annuel'
}



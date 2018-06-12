export class Modification {
    
  public ident: number;

  constructor( public idTache: number, public donnee: Donnee, public valeurAvant: string, public valeurApres: string) {

  }
}

export enum Donnee {
  MARQUE_VEHICULE = 'Marque du véhicule',
  MODELE_VEHICULE = 'Modèle du véhicule',
  DESIGNATION_VEHICULE = 'Désignation du véhicule',
  IMMATRICULATION_VEHICULE = 'L\'immatriculation du véhicule',
  MEC_VEHICULE = 'Date de mise en circulation du véhicule',
  MA_VEHICULE = 'Mode d\'acquisition',
  DA_VEHICULE = 'Date d\'acquisition',
  NUMERO_PERMIS = 'Numéro du permis' ,
  CATEGORIE_PERMIS ='Catégorie du permis',
  DATE_PERMIS = 'Date de délivrance du permis',
  DEPARTEMENT_PERMIS = 'Département sur le permis',
  PREFECTURE_PERMIS = 'Prédécture sur le permis',
  CRM_CONDUCTEUR = 'CRM', 
  CRM2_CONDUCTEUR = 'Deuxième CRM',
  DOCRM05_CONDUCTEUR = 'Date obtention CRM 0.5',
  RESP100_CONDUCTEUR = 'Résponsabilité 100%',
  RESP50_CONDUCTEUR = 'Résponsabilité 50%',
  RESP0_CONDUCTEUR = 'Résponsabilité 0%',
  VI_CONDUCTEUR = 'Vol et incendie',
  BDG_CONDUCTEUR = 'Bris de glace',
  STATIONNEMENT_CONDUCTEUR = 'Sationnement'
}
  
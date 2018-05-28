import { Groupe } from "./groupe";

export class Utilisateur {

  public prenom:	String
 

  constructor(public ident: number, public nom: string, public profil: Profil) {}
}
export enum Profil {
  GESTIONNAIRE = 'Gestionnaire',
  SUPERVISEUR = 'Superviseur',
  DIRECTEUR = 'Directeur'
}


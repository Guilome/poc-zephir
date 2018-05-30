
export class Utilisateur {

  constructor(public ident: number, public nom: string, public prenom:	String, public profil: Profil ) {}
}
export enum Profil {
  GESTIONNAIRE = 'Gestionnaire',
  SUPERVISEUR = 'Superviseur',
  DIRECTEUR = 'Directeur'
}


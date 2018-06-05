
export class Utilisateur {

  constructor(public ident: number, public nom: string, public prenom:	String, public profil: Profil,public idGroupe: number ) {}
}
export enum Profil {
  GESTIONNAIRE = 'Gestionnaire',
  SUPERVISEUR = 'Superviseur',
  DIRECTEUR = 'Directeur'
}


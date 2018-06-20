import { Profil } from "./profil";

export class Utilisateur {

  constructor(public ident: number, public nom: string, public prenom:	String, public profil: Profil, public verification: boolean, public validation: boolean, public avenant: boolean) {}
}



import { Groupe } from "./Groupe";

export class Profil {

    public ident: number;
    public groupes = []

    constructor(public code: ProfilCode, public AFN: boolean, public AVN: boolean, public RES: boolean, public REF: boolean){
        if(AFN) this.groupes.push(1);
        if(AVN) this.groupes.push(2);
        if(REF) this.groupes.push(3);
        if(RES) this.groupes.push(4);
    }
}

export enum ProfilCode {
    GESTIONNAIRE = 'Gestionnaire',
    SUPERVISEUR = 'Superviseur',
    DIRECTEUR = 'Directeur'
  }
  
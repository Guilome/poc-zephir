export class Profil {

    public ident: number;


    constructor(public code: ProfilCode, public AFN: boolean, public AVN: boolean, public RES: boolean, public REF: boolean){
        
    }
}

export enum ProfilCode {
    GESTIONNAIRE = 'Gestionnaire',
    SUPERVISEUR = 'Superviseur',
    DIRECTEUR = 'Directeur'
  }
  
  

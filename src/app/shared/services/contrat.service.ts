import { Injectable } from '@angular/core';
import { TacheService } from './tache.service';
import { ActionMetierService } from './action-metier.service';
import { Tache } from '../domain/Tache';
import { Contrat, Fractionnement } from '../domain/contrat';

@Injectable()
export class ContratService {

  private listeContrats: Contrat[] = []
  private listeTaches: Tache[] = []
  
  constructor(public tacheService: TacheService) {
    const contrat1 = new Contrat(7543663,'SOLUTIO');
    contrat1.numero = 'S14058101';
    contrat1.nomAppelIntermediaire = 'PLANETE ASSURANCES NIMES';
    contrat1.nomAppelClient = 'LAARAJ KHALID';
    contrat1.fractionnement = Fractionnement.M;
    contrat1.dateCreation = new Date('02/06/2018');
    contrat1.dateEffet = new Date('03/08/2018');
    contrat1.idUtilisateur = 1

    this.listeContrats.push(contrat1)
    
    const contrat2 = new Contrat(7504437,'SOLUTIO');
    contrat2.numero = 'S14057443';
    contrat2.nomAppelIntermediaire = 'RAUXET ALEXANDRE';
    contrat2.nomAppelClient = 'VIDALENC THOMAS';
    contrat2.fractionnement = Fractionnement.M;
    contrat2.dateCreation = new Date('01/23/2018');
    contrat2.dateEffet = new Date('01/23/2018');
    contrat2.idUtilisateur = 1

    this.listeContrats.push(contrat2)

    const contrat3 = new Contrat(7584136,'SOLUTIO');
    contrat3.numero = 'S14058873';
    contrat3.nomAppelIntermediaire = 'ACMA COURTAGE';
    contrat3.nomAppelClient = 'SCHADKOWSKI STEPHANE';
    contrat3.fractionnement = Fractionnement.S;
    contrat3.dateCreation = new Date('01/23/2018');
    contrat3.dateEffet = new Date('01/23/2018');
    contrat3.idUtilisateur = 1

    this.listeContrats.push(contrat3)

    const contrat4 = new Contrat(7215959,'SOLUTIO');
    contrat4.numero = 'S14059921';
    contrat4.nomAppelIntermediaire = 'DAFFIT BRUNO';
    contrat4.nomAppelClient = 'GATEAU MARJOLAINE';
    contrat4.fractionnement = Fractionnement.M;
    contrat4.dateCreation = new Date('03/12/2018');
    contrat4.dateEffet = new Date('03/12/2018');
    contrat4.idUtilisateur = 1

    this.listeContrats.push(contrat4)

    const contrat5 = new Contrat(7483409,'SOLUTIO');
    contrat5.numero = 'S14058698';
    contrat5.nomAppelIntermediaire = 'BOUCHE ET VERLOO';
    contrat5.nomAppelClient = 'ALAVOINE SYLVIA';
    contrat5.fractionnement = Fractionnement.M;
    contrat5.dateCreation = new Date('02/19/2018');
    contrat5.dateEffet = new Date('02/19/2018');
    contrat5.idUtilisateur = 1

    this.listeContrats.push(contrat5)

    const contrat6 = new Contrat(7478984,'SOLUTIO');
    contrat6.numero = 'S14056952';
    contrat6.nomAppelIntermediaire = 'TROUSSARD CHRISTOPHE';
    contrat6.nomAppelClient = 'DROUIN HERVE';
    contrat6.fractionnement = Fractionnement.M;
    contrat6.dateCreation = new Date('01/12/2018');
    contrat6.dateEffet = new Date('01/15/2018');
    contrat6.idUtilisateur = 1

    this.listeContrats.push(contrat6)  

    const contrat7 = new Contrat(7539150,'SOLUTIO');
    contrat7.numero = 'S14058662';
    contrat7.nomAppelIntermediaire = 'A2N ASSURANCES';
    contrat7.nomAppelClient = 'ADAM GUY';
    contrat7.fractionnement = Fractionnement.A;
    contrat7.dateCreation = new Date('02/16/2018');
    contrat7.dateEffet = new Date('02/16/2018');
    contrat7.idUtilisateur = 1

    this.listeContrats.push(contrat7)

    const contrat8 = new Contrat(7561996,'SOLUTIO');
    contrat8.numero = 'S14058532';
    contrat8.nomAppelIntermediaire = 'DIFFUSION ASSURANCES RHONE ALP';
    contrat8.nomAppelClient = 'BLAISE PAULINE';
    contrat8.fractionnement = Fractionnement.M;
    contrat8.dateCreation = new Date('02/14/2018');
    contrat8.dateEffet = new Date('02/16/2018');
    contrat8.idUtilisateur = 2

    this.listeContrats.push(contrat8)

    const contrat9 = new Contrat(7606547,'SOLUTIO');
    contrat9.numero = 'S14059342';
    contrat9.nomAppelIntermediaire = 'DELRANC PHILIPPE';
    contrat9.nomAppelClient = 'BERQUEZ CHRISTIAN';
    contrat9.fractionnement = Fractionnement.A;
    contrat9.dateCreation = new Date('03/02/2018');
    contrat9.dateEffet = new Date('02/22/2018');
    contrat9.idUtilisateur = 2

    this.listeContrats.push(contrat9)  

    const contrat10 = new Contrat(7475146,'SOLUTIO');
    contrat10.numero = 'S14057813';
    contrat10.nomAppelIntermediaire = 'MARTIN SANDRA';
    contrat10.nomAppelClient = 'FABRE SYLVIE';
    contrat10.fractionnement = Fractionnement.M;
    contrat10.dateCreation = new Date('01/31/2018');
    contrat10.dateEffet = new Date('02/01/2018');
    contrat10.idUtilisateur = 2

    this.listeContrats.push(contrat10) 

    const contrat11 = new Contrat(7405964,'SOLUTIO');
    contrat11.numero = 'S14057088';
    contrat11.nomAppelIntermediaire = 'DCB ASSURANCES';
    contrat11.nomAppelClient = 'LAGRANGE THIERRY';
    contrat11.fractionnement = Fractionnement.M;
    contrat11.dateCreation = new Date('01/16/2018');
    contrat11.dateEffet = new Date('01/18/2018');
    contrat11.idUtilisateur = 2
  
    this.listeContrats.push(contrat11)
  
    const contrat12 = new Contrat(7250556,'SOLUTIO');
    contrat12.numero = 'S14059107';
    contrat12.nomAppelIntermediaire = 'ANDRE PHILIPPE';
    contrat12.nomAppelClient = 'CHANTEAU MICHEL';
    contrat12.fractionnement = Fractionnement.M;
    contrat12.dateCreation = new Date('02/27/2018');
    contrat12.dateEffet = new Date('04/01/2018');
    contrat12.idUtilisateur = 3
  
    this.listeContrats.push(contrat12)  
  
    const contrat13 = new Contrat(7562385,'SOLUTIO');
    contrat13.numero = 'S14058539';
    contrat13.nomAppelIntermediaire = 'BOUNHOURE CLAUDE';
    contrat13.nomAppelClient = 'PAVE MATHILDE';
    contrat13.fractionnement = Fractionnement.A;
    contrat13.dateCreation = new Date('02/14/2018');
    contrat13.dateEffet = new Date('02/14/2018');
    contrat13.idUtilisateur = 3
  
    this.listeContrats.push(contrat13)

    const contrat14 = new Contrat(7469664,'SOLUTIO');
    contrat14.numero = 'S14056999';
    contrat14.nomAppelIntermediaire = 'BOURREC JEAN FRANCOIS';
    contrat14.nomAppelClient = 'POMAREL MAGALI';
    contrat14.fractionnement = Fractionnement.M;
    contrat14.dateCreation = new Date('01/13/2018');
    contrat14.dateEffet = new Date('01/13/2018');
    contrat14.idUtilisateur = 3
  
    this.listeContrats.push(contrat14)
  
    const contrat15 = new Contrat(7469494,'SOLUTIO');
    contrat15.numero = 'S14056736';
    contrat15.nomAppelIntermediaire = 'BRU BERNARD';
    contrat15.nomAppelClient = 'SEMANI HAKIM';
    contrat15.fractionnement = Fractionnement.M;
    contrat15.dateCreation = new Date('01/09/2018');
    contrat15.dateEffet = new Date('01/10/2018');
    contrat15.idUtilisateur = 3
  
    this.listeContrats.push(contrat15)  

    const contrat16 = new Contrat(7542462,'SOLUTIO');
    contrat16.numero = 'S14059806';
    contrat16.nomAppelIntermediaire = 'COURTAGE CONSEIL CHAMPAGNE';
    contrat16.nomAppelClient = 'SERGY MARION';
    contrat16.fractionnement = Fractionnement.M;
    contrat16.dateCreation = new Date('03/08/2018');
    contrat16.dateEffet = new Date('04/11/2018');
    contrat16.idUtilisateur = 3
  
    this.listeContrats.push(contrat16)
  
    const contrat17 = new Contrat(7454661,'SOLUTIO');
    contrat17.numero = 'S14056356';
    contrat17.nomAppelIntermediaire = 'PACHINS JEAN-PAUL';
    contrat17.nomAppelClient = 'PEZON ISAURA';
    contrat17.fractionnement = Fractionnement.A;
    contrat17.dateCreation = new Date('01/04/2018');
    contrat17.dateEffet = new Date('12/04/2017');
    contrat17.idUtilisateur = 4
  
    this.listeContrats.push(contrat17)
  
    const contrat18 = new Contrat(7484014,'SOLUTIO');
    contrat18.numero = 'S14057068';
    contrat18.nomAppelIntermediaire = 'BARONNET ET BLOQUERT';
    contrat18.nomAppelClient = 'TOMADIN STEPHANIE';
    contrat18.fractionnement = Fractionnement.M;
    contrat18.dateCreation = new Date('01/16/2018');
    contrat18.dateEffet = new Date('12/29/2017');
    contrat18.idUtilisateur = 4
  
    this.listeContrats.push(contrat18)
  
    const contrat19 = new Contrat(7630678,'SOLUTIO');
    contrat19.numero = 'S14059975';
    contrat19.nomAppelIntermediaire = 'BRIENNE PASCAL';
    contrat19.nomAppelClient = 'MAHIEZ JULIEN';
    contrat19.fractionnement = Fractionnement.A;
    contrat19.dateCreation = new Date('03/13/2018');
    contrat19.dateEffet = new Date('03/13/2018');
    contrat19.idUtilisateur = 4
  
    this.listeContrats.push(contrat19)

    const contrat20 = new Contrat(7623869,'SOLUTIO');
    contrat20.numero = 'S14059908';
    contrat20.nomAppelIntermediaire = 'ALPHONSE ET GRUAZ';
    contrat20.nomAppelClient = 'CANTOT AURELIEN';
    contrat20.fractionnement = Fractionnement.M;
    contrat20.dateCreation = new Date('03/12/2018');
    contrat20.dateEffet = new Date('03/12/2018');
    contrat20.idUtilisateur = 4
  
    this.listeContrats.push(contrat20)

    const contrat21 = new Contrat(7241544,'SOLUTIO');
    contrat21.numero = 'S14056847';
    contrat21.nomAppelIntermediaire = 'CHAUVIN JEAN-PAUL';
    contrat21.nomAppelClient = 'GELPI CLAUDE';
    contrat21.fractionnement = Fractionnement.M;
    contrat21.dateCreation = new Date('01/10/2018');
    contrat21.dateEffet = new Date('02/16/2018');
    contrat21.idUtilisateur = 4
  
    this.listeContrats.push(contrat21)
  
    const contrat22 = new Contrat(7469554,'SOLUTIO');
    contrat22.numero = 'S14056734';
    contrat22.nomAppelIntermediaire = 'LISE MONIQUE';
    contrat22.nomAppelClient = 'PREVOST LEONARDO';
    contrat22.fractionnement = Fractionnement.M;
    contrat22.dateCreation = new Date('01/09/2018');
    contrat22.dateEffet = new Date('01/09/2018');
    contrat22.idUtilisateur = 5
  
    this.listeContrats.push(contrat22)
  
    const contrat23 = new Contrat(7472959,'SOLUTIO');
    contrat23.numero = 'S14057266';
    contrat23.nomAppelIntermediaire = 'DOMBES BRESSE COURTAGE';
    contrat23.nomAppelClient = 'MOUROUX FLORENTIN';
    contrat23.fractionnement = Fractionnement.M;
    contrat23.dateCreation = new Date('01/19/2018');
    contrat23.dateEffet = new Date('01/20/2018');
    contrat23.idUtilisateur = 5
  
    this.listeContrats.push(contrat23)
  
    const contrat24 = new Contrat(7422294,'SOLUTIO');
    contrat24.numero = 'S14056917';
    contrat24.nomAppelIntermediaire = 'SEBAG ASSURANCES';
    contrat24.nomAppelClient = 'LEROY AXELLE';
    contrat24.fractionnement = Fractionnement.M;
    contrat24.dateCreation = new Date('01/12/2018');
    contrat24.dateEffet = new Date('01/12/2018');
    contrat24.idUtilisateur = 5
  
    this.listeContrats.push(contrat24)
    this.affecterTacheContrat()
  }

  getAll() {
    return this.listeContrats
  }

  getContratByid(ident: number){
    return this.listeContrats.filter(contrat => contrat.idUtilisateur == ident)
  }

  getContratByIdUtilisateur(identUtilisateur: number) {    
    return this.listeContrats.filter(contrat => contrat.idUtilisateur == identUtilisateur)
  }

  affecterTacheContrat() {
    this.tacheService.listerTaches().subscribe(data => this.listeTaches = data);
    this.listeContrats.forEach(contrat => {
      this.listeTaches.forEach( tache => {
        if(contrat.numero == tache.context.contrat.numero) {
          contrat.listeTaches.push(tache)
        }
      })
    })
  }
}

import { Injectable } from '@angular/core';
import { Tache, Nature} from '../domain/Tache';
import { Context } from '../domain/context';
import { Contrat, NatureContrat, Fractionnement } from '../domain/contrat';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class ActionMetierService {

  listActionMetier = [];

  actionMetierSubject: BehaviorSubject<Tache[]> = new BehaviorSubject([]);

  getById(id: number) {
    return this.listActionMetier.find(t => t.ident === id);
  }
  getAllByIdContext(idContext: number): BehaviorSubject<Tache[]>{
    this.actionMetierSubject.next(this.listActionMetier.filter(act => act.context.ident == idContext));
    return this.actionMetierSubject;
  }

  private create(tache: Tache, code: string) {

    const a = new Tache(Nature.TACHE);
    a.ident = tache.ident;
    a.message = tache.message;
    a.idUtilisateur = null;
    a.idGroupe = tache.idGroupe;
    a.context = tache.context;
    a.code = code;
    a.dateCreation = new Date();
    a.priorite = 1;
    this.listActionMetier.push(a);
    this.actionMetierSubject.next(this.listActionMetier.filter(act => act.context == tache.context));
  }

  createDemandeAvt(tache: Tache) {
    this.create(tache, 'AVENANT');
  }
  createSansEffet(tache: Tache){
    this.create(tache, 'SANS_EFFET');
  }

  constructor() { 
    const contrat1 = new Contrat(7543663,'SOLUTIO');
    contrat1.numero = 'S14058101';
    contrat1.nomAppelIntermediaire = 'PLANETE ASSURANCES NIMES';
    contrat1.nomAppelClient = 'LAARAJ KHALID';
    contrat1.fractionnement = Fractionnement.M;
    contrat1.dateCreation = new Date('06/02/2018');
    contrat1.dateEffet = new Date('08/03/2018');

    const context1 = new Context(1000010, 'LAARAJ KHALID', 'PLANETE ASSURANCES NIMES', contrat1);
    
    const a1 = new Tache(Nature.TACHE);
    a1.ident = 1200010;
    a1.idUtilisateur = 1;
    a1.idGroupe = 4;
    a1.context = context1;
    a1.code = 'DEV';
    a1.dateCreation = new Date('10/05/2018');
    a1.priorite = 1;

    //--
    const contrat2 = new Contrat(7504437,'SOLUTIO');
    contrat2.numero = 'S14057443';
    contrat2.nomAppelIntermediaire = 'RAUXET ALEXANDRE';
    contrat2.nomAppelClient = 'VIDALENC THOMAS';
    contrat2.fractionnement = Fractionnement.M;
    contrat2.dateCreation = new Date('23/01/2018');
    contrat2.dateEffet = new Date('23/01/2018');

    const context2 = new Context(1000020, 'VIDALENC THOMAS', 'RAUXET ALEXANDRE', contrat2);

    const a2 = new Tache(Nature.TACHE);
    a2.ident = 1200020;
    a2.idUtilisateur = 1;
    a2.idGroupe = 4;
    a2.context = context2;
    a2.code = 'DEV';
    a2.dateCreation = new Date('10/05/2018');
    a2.priorite = 1;

    //////--
    const contrat3 = new Contrat(7584136,'SOLUTIO');
    contrat3.numero = 'S14058873';
    contrat3.nomAppelIntermediaire = 'ACMA COURTAGE';
    contrat3.nomAppelClient = 'SCHADKOWSKI STEPHANE';
    contrat3.fractionnement = Fractionnement.S;
    contrat3.dateCreation = new Date('23/01/2018');
    contrat3.dateEffet = new Date('23/01/2018');

    const context3 = new Context(1200030, 'SCHADKOWSKI STEPHANE', 'ACMA COURTAGE', contrat3);

    const a3 = new Tache(Nature.TACHE);
    a3.ident = 1200030;
    a3.idUtilisateur = 1;
    a3.idGroupe = 3;
    a3.context = context3;
    a3.code = 'DEV_AVT';
    a3.dateCreation = new Date('10/05/2018');
    a3.priorite = 1;

    ////--

    const contrat4 = new Contrat(7215959,'SOLUTIO');
    contrat4.numero = 'S14059921';
    contrat4.nomAppelIntermediaire = 'DAFFIT BRUNO';
    contrat4.nomAppelClient = 'GATEAU MARJOLAINE';
    contrat4.fractionnement = Fractionnement.M;
    contrat4.dateCreation = new Date('12/03/2018');
    contrat4.dateEffet = new Date('12/03/2018');

    const context4= new Context(1200040 , 'GATEAU MARJOLAINE', 'DAFFIT BRUNO', contrat4);

    const a4 = new Tache(Nature.TACHE);
    a4.ident = 1200040;
    a4.idUtilisateur = 1;
    a4.idGroupe = 3;
    a4.context = context4;
    a4.code = 'RESIL';
    a4.dateCreation = new Date('10/05/2018');
    a4.priorite = 1;

    ////--

    const contrat5 = new Contrat(7483409,'SOLUTIO');
    contrat5.numero = 'S14058698';
    contrat5.nomAppelIntermediaire = 'BOUCHE ET VERLOO';
    contrat5.nomAppelClient = 'ALAVOINE SYLVIA';
    contrat5.fractionnement = Fractionnement.M;
    contrat5.dateCreation = new Date('19/02/2018');
    contrat5.dateEffet = new Date('19/02/2018');

    const context5= new Context(1200050 , 'ALAVOINE SYLVIA', 'BOUCHE ET VERLOO', contrat5);

    const a5 = new Tache(Nature.TACHE);
    a5.ident = 1200050;
    a5.idUtilisateur = 1;
    a5.idGroupe = 3;
    a5.context = context5;
    a5.code = 'AVENANT';
    a5.dateCreation = new Date('10/05/2018');
    a5.priorite = 1;

    //////--
    const contrat6 = new Contrat(7478984,'SOLUTIO');
    contrat6.numero = 'S14056952';
    contrat6.nomAppelIntermediaire = 'TROUSSARD CHRISTOPHE';
    contrat6.nomAppelClient = 'DROUIN HERVE';
    contrat6.fractionnement = Fractionnement.M;
    contrat6.dateCreation = new Date('12/01/2018');
    contrat6.dateEffet = new Date('15/01/2018');

    const context6= new Context(1200060 , 'DROUIN HERVE', 'TROUSSARD CHRISTOPHE', contrat6);

    const a6 = new Tache(Nature.TACHE);
    a6.ident = 1200060;
    a6.idUtilisateur = 1;
    a6.idGroupe = 3;
    a6.context = context6;
    a6.code = 'AVENANT';
    a6.dateCreation = new Date('10/05/2018');
    a6.priorite = 1;

    //////--
    const contrat7 = new Contrat(7539150,'SOLUTIO');
    contrat7.numero = 'S14058662';
    contrat7.nomAppelIntermediaire = 'A2N ASSURANCES';
    contrat7.nomAppelClient = 'ADAM GUY';
    contrat7.fractionnement = Fractionnement.A;
    contrat7.dateCreation = new Date('16/02/2018');
    contrat7.dateEffet = new Date('16/02/2018');

    const context7= new Context(1200070 , 'ADAM GUY', 'A2N ASSURANCES', contrat7);

    const a7 = new Tache(Nature.TACHE);
    a7.ident = 1200070;
    a7.idUtilisateur = 1;
    a7.idGroupe = 4;
    a7.context = context7;
    a7.code = 'DEV_AFN';
    a7.dateCreation = new Date('10/05/2018');
    a7.priorite = 1;

    //////--
    const contrat8 = new Contrat(7561996,'SOLUTIO');
    contrat8.numero = 'S14058532';
    contrat8.nomAppelIntermediaire = 'DIFFUSION ASSURANCES RHONE ALP';
    contrat8.nomAppelClient = 'BLAISE PAULINE';
    contrat8.fractionnement = Fractionnement.M;
    contrat8.dateCreation = new Date('14/02/2018');
    contrat8.dateEffet = new Date('16/02/2018');

    const context8= new Context(1200080 , 'BLAISE PAULINE', 'DIFFUSION ASSURANCES RHONE ALP', contrat8);

    const a8 = new Tache(Nature.TACHE);
    a8.ident = 1200080;
    a8.idUtilisateur = 1;
    a8.idGroupe = 3;
    a8.context = context8;
    a8.code = 'DEV_AVT';
    a8.dateCreation = new Date('10/05/2018');
    a8.priorite = 1;

    //////--
    const contrat9 = new Contrat(7606547,'SOLUTIO');
    contrat9.numero = 'S14059342';
    contrat9.nomAppelIntermediaire = 'DELRANC PHILIPPE';
    contrat9.nomAppelClient = 'BERQUEZ CHRISTIAN';
    contrat9.fractionnement = Fractionnement.A;
    contrat9.dateCreation = new Date('02/03/2018');
    contrat9.dateEffet = new Date('22/02/2018');

    const context9= new Context(1200090 , 'BERQUEZ CHRISTIAN', 'DELRANC PHILIPPE', contrat9);

    const a9 = new Tache(Nature.TACHE);
    a9.ident = 1200090;
    a9.idUtilisateur = 1;
    a9.idGroupe = 3;
    a9.context = context9;
    a9.code = 'DEV_AVT';
    a9.dateCreation = new Date('10/05/2018');
    a9.priorite = 1;

    //////--
    const contrat10 = new Contrat(7475146,'SOLUTIO');
    contrat10.numero = 'S14057813';
    contrat10.nomAppelIntermediaire = 'MARTIN SANDRA';
    contrat10.nomAppelClient = 'FABRE SYLVIE';
    contrat10.fractionnement = Fractionnement.M;
    contrat10.dateCreation = new Date('31/01/2018');
    contrat10.dateEffet = new Date('01/02/2018');

    const context10= new Context(1200100 , 'FABRE SYLVIE', 'MARTIN SANDRA', contrat10);

    const a10 = new Tache(Nature.TACHE);
    a10.ident = 1200100;
    a10.idUtilisateur = 1;
    a10.idGroupe = 3;
    a10.context = context10;
    a10.code = 'RESIL';
    a10.dateCreation = new Date('10/05/2018');
    a10.priorite = 1;

    //////--
    const contrat11 = new Contrat(7405964,'SOLUTIO');
    contrat11.numero = 'S14057088';
    contrat11.nomAppelIntermediaire = 'DCB ASSURANCES';
    contrat11.nomAppelClient = 'LAGRANGE THIERRY';
    contrat11.fractionnement = Fractionnement.M;
    contrat11.dateCreation = new Date('16/01/2018');
    contrat11.dateEffet = new Date('18/01/2018');

    const context11= new Context(1200110 , 'LAGRANGE THIERRY', 'DCB ASSURANCES', contrat11);

    const a11 = new Tache(Nature.TACHE);
    a11.ident = 1200110;
    a11.idUtilisateur = 1;
    a11.idGroupe = 4;
    a11.context = context11;
    a11.code = 'SANS_EFFET';
    a11.dateCreation = new Date('10/05/2018');
    a11.priorite = 1;

    //////--

    const contrat12 = new Contrat(7250556,'SOLUTIO');
    contrat12.numero = 'S14059107';
    contrat12.nomAppelIntermediaire = 'ANDRE PHILIPPE';
    contrat12.nomAppelClient = 'CHANTEAU MICHEL';
    contrat12.fractionnement = Fractionnement.M;
    contrat12.dateCreation = new Date('27/02/2018');
    contrat12.dateEffet = new Date('01/04/2018');

    const context12= new Context(1200120 , 'CHANTEAU MICHEL', 'ANDRE PHILIPPE', contrat12);

    const a12 = new Tache(Nature.TACHE);
    a12.ident = 1200120;
    a12.idUtilisateur = 1;
    a12.idGroupe = 4;
    a12.context = context12;
    a12.code = 'SANS_EFFET';
    a12.dateCreation = new Date('10/05/2018');
    a12.priorite = 1;

    //////--

    const contrat13 = new Contrat(7562385,'SOLUTIO');
    contrat13.numero = 'S14058539';
    contrat13.nomAppelIntermediaire = 'BOUNHOURE CLAUDE';
    contrat13.nomAppelClient = 'PAVE MATHILDE';
    contrat13.fractionnement = Fractionnement.A;
    contrat13.dateCreation = new Date('14/02/2018');
    contrat13.dateEffet = new Date('14/02/2018');

    const context13= new Context(1200130 , 'PAVE MATHILDE', 'BOUNHOURE CLAUDE', contrat13);

    const a13 = new Tache(Nature.TACHE);
    a13.ident = 1200130;
    a13.idUtilisateur = 1;
    a13.idGroupe = 4;
    a13.context = context13;
    a13.code = 'SANS_EFFET';
    a13.dateCreation = new Date('10/05/2018');
    a13.priorite = 1;

    //////--

    const contrat14 = new Contrat(7469664,'SOLUTIO');
    contrat14.numero = 'S14056999';
    contrat14.nomAppelIntermediaire = 'BOURREC JEAN FRANCOIS';
    contrat14.nomAppelClient = 'POMAREL MAGALI';
    contrat14.fractionnement = Fractionnement.M;
    contrat14.dateCreation = new Date('13/01/2018');
    contrat14.dateEffet = new Date('13/01/2018');

    const context14= new Context(1200140 , 'POMAREL MAGALI', 'BOURREC JEAN FRANCOIS', contrat14);

    const a14 = new Tache(Nature.TACHE);
    a14.ident = 1200140;
    a14.idUtilisateur = 1;
    a14.idGroupe = 3;
    a14.context = context14;
    a14.code = 'AVENANT';
    a14.dateCreation = new Date('10/05/2018');
    a14.priorite = 1;

    //////--

    const contrat15 = new Contrat(7469494,'SOLUTIO');
    contrat15.numero = 'S14056736';
    contrat15.nomAppelIntermediaire = 'BRU BERNARD';
    contrat15.nomAppelClient = 'SEMANI HAKIM';
    contrat15.fractionnement = Fractionnement.M;
    contrat15.dateCreation = new Date('09/01/2018');
    contrat15.dateEffet = new Date('10/01/2018');

    const context15= new Context(1200150 , 'SEMANI HAKIM', 'BRU BERNARD', contrat15);

    const a15 = new Tache(Nature.TACHE);
    a15.ident = 1200150;
    a15.idUtilisateur = 1;
    a15.idGroupe = 3;
    a15.context = context15;
    a15.code = 'AVENANT';
    a15.dateCreation = new Date('10/05/2018');
    a15.priorite = 1;


    //////--
    const contrat16 = new Contrat(7542462,'SOLUTIO');
    contrat16.numero = 'S14059806';
    contrat16.nomAppelIntermediaire = 'COURTAGE CONSEIL CHAMPAGNE';
    contrat16.nomAppelClient = 'SERGY MARION';
    contrat16.fractionnement = Fractionnement.M;
    contrat16.dateCreation = new Date('08/03/2018');
    contrat16.dateEffet = new Date('11/04/2018');

    const context16= new Context(1200160 , 'SERGY MARION', 'COURTAGE CONSEIL CHAMPAGNE', contrat16);


    const a16 = new Tache(Nature.TACHE);
    a16.ident = 1200160;
    a16.idUtilisateur = 1;
    a16.idGroupe = 3;
    a16.context = context16;
    a16.code = 'AVENANT';
    a16.dateCreation = new Date('10/05/2018');
    a16.priorite = 1;

    //////--

    const contrat17 = new Contrat(7454661,'SOLUTIO');
    contrat17.numero = 'S14056356';
    contrat17.nomAppelIntermediaire = 'PACHINS JEAN-PAUL';
    contrat17.nomAppelClient = 'PEZON ISAURA';
    contrat17.fractionnement = Fractionnement.A;
    contrat17.dateCreation = new Date('04/01/2018');
    contrat17.dateEffet = new Date('04/12/2017');

    const context17= new Context(1200170 , 'PEZON ISAURA', 'PACHINS JEAN-PAUL', contrat17);

    const a17 = new Tache(Nature.TACHE);
    a17.ident = 1200170;
    a17.idUtilisateur = 1;
    a17.idGroupe = 3;
    a17.context = context17;
    a17.code = 'AVENANT';
    a17.dateCreation = new Date('10/05/2018');
    a17.priorite = 1;

    //////--

    const contrat18 = new Contrat(7484014,'SOLUTIO');
    contrat18.numero = 'S14057068';
    contrat18.nomAppelIntermediaire = 'BARONNET ET BLOQUERT';
    contrat18.nomAppelClient = 'TOMADIN STEPHANIE';
    contrat18.fractionnement = Fractionnement.M;
    contrat18.dateCreation = new Date('16/01/2018');
    contrat18.dateEffet = new Date('29/12/2017');

    const context18= new Context(1200180 , 'TOMADIN STEPHANIE', 'BARONNET ET BLOQUERT', contrat18);

    const a18 = new Tache(Nature.TACHE);
    a18.ident = 1200180;
    a18.idUtilisateur = 1;
    a18.idGroupe = 3;
    a18.context = context18;
    a18.code = 'AVENANT';
    a18.dateCreation = new Date('10/05/2018');
    a18.priorite = 1;

    //////--

    const contrat19 = new Contrat(7630678,'SOLUTIO');
    contrat19.numero = 'S14059975';
    contrat19.nomAppelIntermediaire = 'BRIENNE PASCAL';
    contrat19.nomAppelClient = 'MAHIEZ JULIEN';
    contrat19.fractionnement = Fractionnement.A;
    contrat19.dateCreation = new Date('13/03/2018');
    contrat19.dateEffet = new Date('13/03/2018');

    const context19= new Context(1200190 , 'MAHIEZ JULIEN', 'BRIENNE PASCAL', contrat19);

    const a19 = new Tache(Nature.TACHE);
    a19.ident = 1200190;
    a19.idUtilisateur = 1;
    a19.idGroupe = 3;
    a19.context = context19;
    a19.code = 'AVENANT';
    a19.dateCreation = new Date('10/05/2018');
    a19.priorite = 1;

    //////--
    const contrat20 = new Contrat(7623869,'SOLUTIO');
    contrat20.numero = 'S14059908';
    contrat20.nomAppelIntermediaire = 'ALPHONSE ET GRUAZ';
    contrat20.nomAppelClient = 'CANTOT AURELIEN';
    contrat20.fractionnement = Fractionnement.M;
    contrat20.dateCreation = new Date('12/03/2018');
    contrat20.dateEffet = new Date('12/03/2018');

    const context20= new Context(1200200 , 'CANTOT AURELIEN', 'ALPHONSE ET GRUAZ', contrat20);

    const a20 = new Tache(Nature.TACHE);
    a20.ident = 1200200;
    a20.idUtilisateur = 1;
    a20.idGroupe = 3;
    a20.context = context20;
    a20.code = 'AVENANT';
    a20.dateCreation = new Date('10/05/2018');
    a20.priorite = 1;

    //////--

    const contrat21 = new Contrat(7241544,'SOLUTIO');
    contrat21.numero = 'S14056847';
    contrat21.nomAppelIntermediaire = 'CHAUVIN JEAN-PAUL';
    contrat21.nomAppelClient = 'GELPI CLAUDE';
    contrat21.fractionnement = Fractionnement.M;
    contrat21.dateCreation = new Date('10/01/2018');
    contrat21.dateEffet = new Date('16/02/2018');

    const context21= new Context(1200210 , 'GELPI CLAUDE', 'CHAUVIN JEAN-PAUL', contrat21);

    const a21 = new Tache(Nature.TACHE);
    a21.ident = 1200210;
    a21.idUtilisateur = 1;
    a21.idGroupe = 3;
    a21.context = context21;
    a21.code = 'AVENANT';
    a21.dateCreation = new Date('10/05/2018');
    a21.priorite = 1;


    //////--

    const contrat22 = new Contrat(7469554,'SOLUTIO');
    contrat22.numero = 'S14056734';
    contrat22.nomAppelIntermediaire = 'LISE MONIQUE';
    contrat22.nomAppelClient = 'PREVOST LEONARDO';
    contrat22.fractionnement = Fractionnement.M;
    contrat22.dateCreation = new Date('09/01/2018');
    contrat22.dateEffet = new Date('09/01/2018');

    const context22= new Context(1200220 , 'PREVOST LEONARDO', 'LISE MONIQUE', contrat22);

    const a22 = new Tache(Nature.TACHE);
    a22.ident = 1200220;
    a22.idUtilisateur = 1;
    a22.idGroupe = 3;
    a22.context = context22;
    a22.code = 'AVENANT';
    a22.dateCreation = new Date('10/05/2018');
    a22.priorite = 1;

    //////--

    const contrat23 = new Contrat(7472959,'SOLUTIO');
    contrat23.numero = 'S14057266';
    contrat23.nomAppelIntermediaire = 'DOMBES BRESSE COURTAGE';
    contrat23.nomAppelClient = 'MOUROUX FLORENTIN';
    contrat23.fractionnement = Fractionnement.M;
    contrat23.dateCreation = new Date('19/01/2018');
    contrat23.dateEffet = new Date('20/01/2018');

    const context23= new Context(1200230 , 'MOUROUX FLORENTIN', 'DOMBES BRESSE COURTAGE', contrat23);

    const a23 = new Tache(Nature.TACHE);
    a23.ident = 1200230;
    a23.idUtilisateur = 1;
    a23.idGroupe = 3;
    a23.context = context23;
    a23.code = 'AVENANT';
    a23.dateCreation = new Date('10/05/2018');
    a23.priorite = 1;

    //////--

    const contrat24 = new Contrat(7422294,'SOLUTIO');
    contrat24.numero = 'S14056917';
    contrat24.nomAppelIntermediaire = 'SEBAG ASSURANCES';
    contrat24.nomAppelClient = 'LEROY AXELLE';
    contrat24.fractionnement = Fractionnement.M;
    contrat24.dateCreation = new Date('12/01/2018');
    contrat24.dateEffet = new Date('14/01/2018');

    const context24= new Context(1200240 , 'LEROY AXELLE', 'SEBAG ASSURANCES', contrat24);

    const a24 = new Tache(Nature.TACHE);
    a24.ident = 1200240;
    a24.idUtilisateur = 1;
    a24.idGroupe = 3;
    a24.context = context24;
    a24.code = 'AVENANT';
    a24.dateCreation = new Date('10/05/2018');
    a24.priorite = 1;

    this.listActionMetier.push(a1)
    this.listActionMetier.push(a2)
    this.listActionMetier.push(a3)
    this.listActionMetier.push(a4)
    this.listActionMetier.push(a5)
    this.listActionMetier.push(a6)
    this.listActionMetier.push(a7)
    this.listActionMetier.push(a8)
    this.listActionMetier.push(a9)
    this.listActionMetier.push(a10)
    this.listActionMetier.push(a11)
    this.listActionMetier.push(a12)
    this.listActionMetier.push(a13)
    this.listActionMetier.push(a14)
    this.listActionMetier.push(a15)
    this.listActionMetier.push(a16)
    this.listActionMetier.push(a17)
    this.listActionMetier.push(a18)
    this.listActionMetier.push(a19)
    this.listActionMetier.push(a20)
    this.listActionMetier.push(a21)
    this.listActionMetier.push(a22)
    this.listActionMetier.push(a23)
    this.listActionMetier.push(a24)

  }

  public getAll(): Tache[]{
    return this.listActionMetier;
  }
}

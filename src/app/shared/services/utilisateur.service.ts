import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Utilisateur} from '../domain/Utilisateur';
import { Profil, ProfilCode } from '../domain/profil';

@Injectable()
export class UtilisateurService {

  private usersSubject: BehaviorSubject<Utilisateur[]> = new BehaviorSubject([]);
  constructor() {

    const listUsers = [];
    listUsers.push(new Utilisateur(1,	'DUPONT',	'Camille', new Profil(ProfilCode.GESTIONNAIRE, true,false,false,false), true, false, false));
    listUsers.push(new Utilisateur(2,	'BARBIER',	'Cédric',	new Profil(ProfilCode.GESTIONNAIRE, false,true,false,false), true, false, true));
    listUsers.push(new Utilisateur(3,	'MOREAU',	'Dominique',	new Profil(ProfilCode.GESTIONNAIRE, true,false,true,false), true, true, false));
    listUsers.push(new Utilisateur(4,	'FOURNIER',	'Martine',	new Profil(ProfilCode.GESTIONNAIRE, true,false,false,true), false, true, false));
    listUsers.push(new Utilisateur(5,	'ROUSSEAU',	'Laurence',	new Profil(ProfilCode.SUPERVISEUR, false,true,false,true), true, true, true));
    listUsers.push(new Utilisateur(6,	'VOLTAIRE',	'Louis',	new Profil(ProfilCode.SUPERVISEUR, true,false,true,false), true, true, false));
    listUsers.push(new Utilisateur(7,	'BOYER',	'Eric',	new Profil(ProfilCode.DIRECTEUR, true,true,true,true), true, true, true));
    this.usersSubject.next(listUsers);
  }

  getAll(): Utilisateur[] {
    return this.usersSubject.getValue();
  }

  getName(idUser: number) {
    return this.getUserById(idUser).nom;
  }

  public getUserById(ident: number) {
    return this.usersSubject.getValue().find(user => user.ident === ident);
  }

  public getUserByIndex(_index: number): Utilisateur {
    const users = this.usersSubject.getValue();
    for (let i = 0 ; i < users.length ; i++ ) {
        if ( i === _index) {
          return users[i];
        }
    }
    return null;
  }
}

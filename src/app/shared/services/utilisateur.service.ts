import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Utilisateur, Profil} from '../domain/Utilisateur';
import {Tache} from '../domain/Tache';
import index from '@angular/cli/lib/cli';

@Injectable()
export class UtilisateurService {

  private usersSubject: BehaviorSubject<Utilisateur[]> = new BehaviorSubject([]);
  constructor() {
    const listUsers = [];
    listUsers.push(new Utilisateur(1,	'DUPONT',	'Camille',	Profil.GESTIONNAIRE));
    listUsers.push(new Utilisateur(2,	'BARBIER',	'Cédric',	Profil.GESTIONNAIRE));
    listUsers.push(new Utilisateur(3,	'MOREAU',	'Dominique',	Profil.GESTIONNAIRE));
    listUsers.push(new Utilisateur(4,	'FOURNIER',	'Martine',	Profil.GESTIONNAIRE));
    listUsers.push(new Utilisateur(5,	'ROUSSEAU',	'Laurence',	Profil.SUPERVISEUR));
    listUsers.push(new Utilisateur(6,	'BOYER',	'Eric',	Profil.DIRECTEUR));


    this.usersSubject.next(listUsers);
  }

  getAll(): Utilisateur[] {
    return this.usersSubject.getValue();
  }

  getName(name: string) {
    return this.getUserById(parseInt(name, 10)).nom;
  }

  getProfil(profil: Profil) {
    return this.getUserById(parseInt(profil, 10)).profil;
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

import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Utilisateur, Profil} from '../domain/Utilisateur';
import {Tache} from '../domain/Tache';
import index from '@angular/cli/lib/cli';

@Injectable()
export class UtilisateurService {

  private usersSubject: BehaviorSubject<Utilisateur[]> = new BehaviorSubject([]);
  constructor() {
    const user1 = new Utilisateur(1, 'Gestionnaire1', Profil.GESTIONNAIRE);
    const user2 = new Utilisateur(2, 'Gestionnaire2', Profil.SUPERVISEUR);
    const user3 = new Utilisateur(3, 'Gestionnaire3', Profil.DIRECTEUR);
    const user4 = new Utilisateur(4, 'Gestionnaire4', Profil.GESTIONNAIRE);

    this.usersSubject.next([user1, user2, user3, user4]);
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

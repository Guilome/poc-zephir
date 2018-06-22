import { Injectable } from '@angular/core';
import {Utilisateur} from '../domain/Utilisateur';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class UtilisateurService {

  constructor() {}
  listUsers = [];  
  usersSubject: BehaviorSubject<Utilisateur[]> = new BehaviorSubject([]);

  getAll(): Utilisateur[] {
    return this.usersSubject.getValue();
  }

  getName(idUser: number) {
    return this.getUserById(idUser).nom;
  }

  public getUserById(ident: number) {
    return this.usersSubject.getValue().find(user => user.ident === ident);
  }

  public ajoutUtilisateur(utilisateur: Utilisateur) {
    this.listUsers.push(utilisateur);
    this.usersSubject.next(this.listUsers);    
  }
}

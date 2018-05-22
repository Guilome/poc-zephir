import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {User} from '../domain/user';
import {Tache} from '../domain/Tache';

@Injectable()
export class UserService {

  private usersSubject: BehaviorSubject<User[]> = new BehaviorSubject([]);
  constructor() {
    const user1 = new User(1, 'Dupont');
    const user2 = new User(2, 'Avia');

    this.usersSubject.next([user1]);
  }

  getAll(): User[] {
    return this.usersSubject.getValue();
  }

  getName(name: string) {
    return this.getUserById(parseInt(name, 10)).name;
  }

  private getUserById(ident: number) {
    return this.usersSubject.getValue().find(user => user.ident === ident);
  }
}

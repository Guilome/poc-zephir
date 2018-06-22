import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {UtilisateurService} from '../shared/services/utilisateur.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {

  constructor(private router: Router, private userService: UtilisateurService) { }

  public userName = '';
  public connexionBoolean = false;
  ngOnInit() {
  }

  ifConnexion(): boolean {
    if (localStorage.getItem('USER') != null) {
      this.userName = this.userService.getName(+localStorage.getItem('USER'))
      this.connexionBoolean = true;
      return true;
    }
    return false;
  }
  deconnexion() {
    localStorage.clear();
    this.connexionBoolean = false;
    this.router.navigate(['Acceuil']);
  }

  closeNav() {
    document.getElementById('myNav').style.width = '0%';
  }

  openNav() {
    document.getElementById('myNav').style.width = '30%';
  }
}

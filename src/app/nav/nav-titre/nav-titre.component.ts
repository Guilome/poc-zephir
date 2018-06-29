import { Component, OnInit } from '@angular/core';
import {TitreService} from '../../shared/services/titre.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nav-titre',
  templateUrl: './nav-titre.component.html',
  styleUrls: ['./nav-titre.component.css']
})
export class NavTitreComponent implements OnInit {

  public titre: string;
  constructor(private titreService: TitreService, private router: Router) { }

  ngOnInit() {
    this.titreService.getTitre().subscribe(titre => this.titre = titre);
  }

  closeNav() {
    document.getElementById('myNav').style.width = '0%';
  }

  openNav() {
    document.getElementById('myNav').style.width = '30%';
  }

  ifConnexion(): boolean {
    return localStorage.getItem('USER') != null && this.router.url.indexOf('TraitementTache') < 0;
  }
}

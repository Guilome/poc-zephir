import { Component, OnInit } from '@angular/core';
import {TitreService} from '../../shared/services/titre.service';

@Component({
  selector: 'app-nav-titre',
  templateUrl: './nav-titre.component.html',
  styleUrls: ['./nav-titre.component.css']
})
export class NavTitreComponent implements OnInit {

  public titre: string;
  constructor(private titreService: TitreService) { }

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
    return localStorage.getItem('USER') != null;
  }
}

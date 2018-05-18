import { Component, OnInit } from '@angular/core';
import {TitreService} from '../../shared/services/titre.service';

@Component({
  selector: 'app-nav-gestion',
  templateUrl: './nav-gestion.component.html',
  styleUrls: ['./nav-gestion.component.css']
})
export class NavGestionComponent implements OnInit {

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

  test() {
    document.getElementById('myNav').style.width = '0%';
    this.titreService.updateTitre('TOTO');
  }

}

import { Component, OnInit } from '@angular/core';
import {Chart} from 'chart.js';
import {TitreService} from '../shared/services/titre.service';
import {Router} from '@angular/router';
@Component({
  selector: 'app-visu-gestion',
  templateUrl: './visu-gestion.component.html',
  styleUrls: ['./visu-gestion.component.css']
})
export class VisuGestionComponent implements OnInit {


  constructor(private titreService: TitreService, private route: Router) { }

  ngOnInit() {
    this.titreService.updateTitre('Tableau de Bord');
  }

  ifConnexion(): boolean {
    if (this.route.url === '/Connexion')
      return true;
    return localStorage.getItem('USER') != null;
  }

}

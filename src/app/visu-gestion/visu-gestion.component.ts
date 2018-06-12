import { Component, OnInit } from '@angular/core';
import {Chart} from 'chart.js';
import {TitreService} from '../shared/services/titre.service';
import {Router} from '@angular/router';
import { TacheService } from '../shared/services/tache.service';
import { ActionMetierService } from '../shared/services/action-metier.service';
@Component({
  selector: 'app-visu-gestion',
  templateUrl: './visu-gestion.component.html',
  styleUrls: ['./visu-gestion.component.css']
})
export class VisuGestionComponent implements OnInit {


  constructor(private titreService: TitreService, 
              private route: Router,
              private tacheservice: TacheService,
              private actionMetierService: ActionMetierService) { }

  ngOnInit() {
    this.titreService.updateTitre('Tableau de Bord');
    // vider la liste des pieces temporaire
    this.tacheservice.removePiecesTemporaire();
    this.actionMetierService.supprimerActionMetierTemporaire();   
  }

  ifConnexion(): boolean {
    if (this.route.url === '/Connexion')
      return true;
    return localStorage.getItem('USER') != null;
  }

}

import { Component, OnInit } from '@angular/core';
import {TitreService} from '../shared/services/titre.service';
import {Router} from '@angular/router';
import { TacheService } from '../shared/services/tache.service';
@Component({
  selector: 'app-visu-gestion',
  templateUrl: './visu-gestion.component.html',
  styleUrls: ['./visu-gestion.component.css']
})
export class VisuGestionComponent implements OnInit {


  constructor(private titreService: TitreService, 
              private route: Router,
              private tacheservice: TacheService) { }

  ngOnInit() {
    this.titreService.updateTitre('Tableau de Bord');
    // vider la liste des pieces temporaire
    this.tacheservice.removeTacheTemporaire();
  }

  ifConnexion(): boolean {
    if (this.route.url === '/Connexion')
      return true;
    return localStorage.getItem('USER') != null;
  }

}

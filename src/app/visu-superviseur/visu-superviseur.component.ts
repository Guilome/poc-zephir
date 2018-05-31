import { Component, OnInit, group } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { GroupeService } from '../shared/services/groupe.service';
import { Code, Groupe } from '../shared/domain/groupe';
import { TacheService } from '../shared/services/tache.service';
import { Tache } from '../shared/domain/Tache';

@Component({
  selector: 'app-visu-superviseur',
  templateUrl: './visu-superviseur.component.html',
  styleUrls: ['./visu-superviseur.component.css']
})
export class VisuSuperviseurComponent implements OnInit {

  constructor(private route: Router) { 
  }

  ngOnInit() {
  }

  ifConnexion(): boolean {
    if (this.route.url === '/Connexion')
      return true;
    return localStorage.getItem('USER') != null;
  }

}

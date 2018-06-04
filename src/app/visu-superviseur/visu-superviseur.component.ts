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

  idGroupe: number

  constructor(private route: Router, private activeRoute: ActivatedRoute) { 
  }

  ngOnInit() {
    this.idGroupe = parseInt(this.activeRoute.snapshot.paramMap.get("id"))
  }

  ifConnexion(): boolean {
    if (this.route.url === '/Connexion')
      return true;    
    localStorage.setItem("GROUPE", this.idGroupe.toString());
    return localStorage.getItem('USER') != null;
  }

}

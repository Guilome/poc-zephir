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

  dossiers: Tache[]
  idGroupe: number
  groupe: Groupe
  jourB: Boolean
  semaineB: Boolean
  moisB: Boolean = true

  constructor(private route: Router, private activeRoute: ActivatedRoute, private groupeService: GroupeService, private tacheService: TacheService) { 
    this.idGroupe = parseInt(activeRoute.snapshot.paramMap.get("id"))
    this.groupe = groupeService.getGroupeById(this.idGroupe)
  }

  ngOnInit() {
  }

  ifConnexion(): boolean {
    if (this.route.url === '/Connexion')
      return true;
    return localStorage.getItem('USER') != null;
  }

  corbeille() {    
    this.groupeService.corbeille(this.groupe.code)
  }

  dispatcher() {
    this.groupeService.dispatcher(this.groupe.code);
  }

  vueBoutton(){
    
  }
}

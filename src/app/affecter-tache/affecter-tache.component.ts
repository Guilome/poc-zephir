import { Component, OnInit } from '@angular/core';
import { TacheService } from '../shared/services/tache.service';
import { Tache } from '../shared/domain/Tache';
import { UtilisateurService } from '../shared/services/utilisateur.service';
import { Utilisateur } from '../shared/domain/Utilisateur';

@Component({
  selector: 'affecter-tache',
  templateUrl: './affecter-tache.component.html',
  styleUrls: ['./affecter-tache.component.css']
})
export class AffecterTacheComponent implements OnInit {

  tache: Tache[] = []
  gestionnaire: Utilisateur[] = []

  constructor(public tacheService: TacheService, public userService: UtilisateurService) { }

  ngOnInit() {
  }

  traiterTache(tabTache: number[]){
    tabTache.forEach(idTache => {
      this.tache.push(this.tacheService.getTacheById(idTache))
    });
  }

  traiterGestionnaire(tabGest: number[]){
    tabGest.forEach(idGestionnaire => {
      this.gestionnaire.push(this.userService.getUserById(idGestionnaire))
    });
  }

  affecterTacheGestionnaire(){    
    this.tache.forEach(t => {
      this.gestionnaire.forEach(g => {
        console.log(t);        
        t.idUtilisateur = g.ident
      });
    });    
  }
}

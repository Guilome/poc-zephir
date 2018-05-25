import { Component, OnInit } from '@angular/core';
import { Tache } from '../../shared/domain/Tache';
import { Utilisateur } from '../../shared/domain/Utilisateur';
import { TacheService } from '../../shared/services/tache.service';
import { UtilisateurService } from '../../shared/services/utilisateur.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-prendre-tache',
  templateUrl: './prendre-tache.component.html',
  styleUrls: ['./prendre-tache.component.css']
})
export class PrendreTacheComponent implements OnInit {

  taches: Tache[] = []
  idGestionnaire: number

  constructor(public tacheService: TacheService, public userService: UtilisateurService, private router: Router) { }

  ngOnInit() {
    this.idGestionnaire = parseInt(localStorage.getItem('USER'))
  }

  traiterTache(tabTache: Tache[]){
    console.log(tabTache);    
    this.taches = tabTache
  }

  affecterTacheGestionnaire(){   
    if (this.taches.length == 0){
      window.alert("Veuillez selectionner des tâches ") 
    }
    else {
      this.taches.forEach(tache => {
        console.log(tache);    
        tache.idUtilisateur = this.idGestionnaire
      });    
    }
    this.router.navigate(['gestionBO'])
  }
}

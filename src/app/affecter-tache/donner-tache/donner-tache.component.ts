import { Component, OnInit } from '@angular/core';
import { TacheService } from '../../shared/services/tache.service';
import { Tache } from '../../shared/domain/Tache';
import { UtilisateurService } from '../../shared/services/utilisateur.service';
import { Utilisateur } from '../../shared/domain/Utilisateur';
import { log } from 'util';
import { Router } from '@angular/router';

@Component({
  selector: 'donner-tache',
  templateUrl: './donner-tache.component.html',
  styleUrls: ['./donner-tache.component.css']
})
export class DonnerTacheComponent implements OnInit {

  taches: Tache[] = []
  gestionnaires: Utilisateur[] = []

  constructor(public tacheService: TacheService, public userService: UtilisateurService, private route: Router) { }

  ngOnInit() {
  }

  traiterTache(tabTache: Tache[]){
    console.log(tabTache);    
    this.taches = tabTache
  }

  traiterGestionnaire(tabGest: Utilisateur[]){
    console.log(tabGest);
    this.gestionnaires = tabGest
  }

  affecterTacheGestionnaire(){   
    if (this.gestionnaires.length == 0 && this.taches.length == 0){
      window.alert("Veuillez selectionner des tâches ou un gestionnaire") 
    }
    else {
      if (this.gestionnaires.length == 1) {
        this.taches.forEach(tache => {
          console.log(tache);      
          this.gestionnaires.forEach(g => {
            console.log(g);        
            tache.idUtilisateur = g.ident
          });
        });    
      }
      else {
        console.log("je suis la");
        this.tacheService.dispatcherGestionnaire(this.gestionnaires, this.taches)
      }
    }
    this.route.navigate(['/page1'])
  }
}

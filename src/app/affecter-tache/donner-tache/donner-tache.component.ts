import { Component, OnInit } from '@angular/core';
import { TacheService } from '../../shared/services/tache.service';
import { Tache } from '../../shared/domain/Tache';
import { UtilisateurService } from '../../shared/services/utilisateur.service';
import { Utilisateur } from '../../shared/domain/Utilisateur';
import { log } from 'util';
import { Router } from '@angular/router';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'donner-tache',
  templateUrl: './donner-tache.component.html',
  styleUrls: ['./donner-tache.component.css']
})
export class DonnerTacheComponent implements OnInit {

  taches: Tache[] = []
  gestionnaires: Utilisateur[] = []
  lesTaches:Tache[]
  lesGestionnaires: Utilisateur[]

  constructor(public tacheService: TacheService, public userService: UtilisateurService, private route: Router, private toastr: ToastrService) { }

  ngOnInit() {
    this.lesGestionnaires = this.userService.getAll()    
    this.tacheService.listerTaches().subscribe(data => this.lesTaches = data)
  }

  traiterTache(tabTache: Tache[]){
    this.taches = tabTache
  }

  traiterGestionnaire(tabGest: Utilisateur[]){
    this.gestionnaires = tabGest
  }

  affecterTacheGestionnaire(){   
    if (this.gestionnaires.length == this.lesGestionnaires.length && this.taches.length == this.lesTaches.length) {
      console.log("test");
      
    }
    if (this.gestionnaires.length == 0 && this.taches.length == 0){
      this.toastr.error("Veuillez selectionner des tâches ou un gestionnaire")
    }
    else {
      if (this.gestionnaires.length == 1) {
        this.taches.forEach(tache => { 
          this.gestionnaires.forEach(g => {
            tache.idUtilisateur = g.ident
          });
        });    
      }
      else {
        this.tacheService.dispatcherGestionnaire(this.gestionnaires, this.taches)
      }
      this.route.navigate(['/GestionGroupe/1'])
    }    
  }
}

import { Component, OnInit } from '@angular/core';
import { Tache } from '../../shared/domain/Tache';
import { Utilisateur } from '../../shared/domain/Utilisateur';
import { TacheService } from '../../shared/services/tache.service';
import { UtilisateurService } from '../../shared/services/utilisateur.service';
import { Router } from '@angular/router';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-prendre-tache',
  templateUrl: './prendre-tache.component.html',
  styleUrls: ['./prendre-tache.component.css']
})
export class PrendreTacheComponent implements OnInit {

  dossiers: Tache[] = []
  idGestionnaire: number

  constructor(private router: Router, private toastr: ToastrService) { }

  ngOnInit() {
    this.idGestionnaire = parseInt(localStorage.getItem('USER'))
  }

  traiterTache(tabTache: Tache[]){
    console.log(tabTache);    
    this.dossiers = tabTache
  }

  affecterTacheGestionnaire(){   
    if (this.dossiers.length == 0){
      this.toastr.error("Veuillez selectionner un/des dossier(s)")
    }
    else {
      this.dossiers.forEach(dossier => {
        console.log(dossier);    
        dossier.idUtilisateur = this.idGestionnaire
      });    
    }
    this.router.navigate(['gestionBO'])
  }
}

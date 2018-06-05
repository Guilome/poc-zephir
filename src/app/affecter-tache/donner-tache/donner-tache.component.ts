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

  dossiers: Tache[] = []
  gestionnaires: Utilisateur[] = []
  lesGestionnaires: Utilisateur[]
  idGroupe: number

  constructor(public tacheService: TacheService,private route: Router, private toastr: ToastrService) { }

  ngOnInit() {
    this.idGroupe = parseInt(localStorage.getItem("GROUPE"))
    
  }

  traiterTache(tabTache: Tache[]){
    this.dossiers = tabTache
  }

  traiterGestionnaire(tabGest: Utilisateur[]){
    this.gestionnaires = tabGest
  }

  affecterTacheGestionnaire(){   
    if (this.gestionnaires.length == 0 && this.dossiers.length == 0){
      this.toastr.error("Veuillez selectionner un ou des dossiers et/ou un ou des gestionnaires")
    }
    else {
      if (this.gestionnaires.length == 1) {
        this.dossiers.forEach(dossier => { 
          this.gestionnaires.forEach(g => {
            dossier.idUtilisateur = g.ident
            let pieces = this.tacheService.getPiecesByDossier(dossier.ident)
            pieces.forEach(piece => piece.idUtilisateur = g.ident)
          });
        });    
      }
      else {
        this.tacheService.dispatcherGestionnaire(this.gestionnaires, this.dossiers)
      }
      this.route.navigate(['/GestionGroupe/'+ this.idGroupe])
    }    
  }
}

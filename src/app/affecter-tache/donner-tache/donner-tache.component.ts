import { Component, OnInit } from '@angular/core';
import { TacheService } from '../../shared/services/tache.service';
import { Tache } from '../../shared/domain/Tache';
import { Utilisateur } from '../../shared/domain/Utilisateur';
import { Router } from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import { TitreService } from '../../shared/services/titre.service';
import { GroupeService } from '../../shared/services/groupe.service';

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

  constructor(private tacheService: TacheService,
              private route: Router, 
              private toastr: ToastrService, 
              private titreService: TitreService, 
              private groupeService: GroupeService) { }

  ngOnInit() {
    this.idGroupe = parseInt(localStorage.getItem("GROUPE"))
    this.titreService.updateTitre("Repartir les tâches")    
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
            dossier.idGroupe = this.idGroupe
            dossier.idUtilisateur = g.ident
            let pieces = this.tacheService.getPiecesByDossier(dossier.ident)
            pieces.forEach(piece => piece.idUtilisateur = g.ident)
          });
        });    
      }
      else {
        this.groupeService.dispatcherGestionnaire(this.gestionnaires, this.dossiers)
      }
      this.route.navigate(['/GestionGroupe/'+ this.idGroupe])
    }    
  }
}

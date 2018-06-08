import { Component, OnInit } from '@angular/core';
import { Tache } from '../../shared/domain/Tache';
import { Utilisateur } from '../../shared/domain/Utilisateur';
import { TacheService } from '../../shared/services/tache.service';
import { UtilisateurService } from '../../shared/services/utilisateur.service';
import { Router } from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import { TitreService } from '../../shared/services/titre.service';

@Component({
  selector: 'app-prendre-tache',
  templateUrl: './prendre-tache.component.html',
  styleUrls: ['./prendre-tache.component.css']
})
export class PrendreTacheComponent implements OnInit {

  dossiers: Tache[] = []
  idGestionnaire: number
  gestionnaire: Utilisateur

  constructor(private utilService: UtilisateurService,
              private tacheService: TacheService,
              private router: Router, 
              private toastr: ToastrService, 
              private titreService: TitreService) { }

  ngOnInit() {
    this.titreService.updateTitre("S'attribuer un dossier")
    this.idGestionnaire = parseInt(localStorage.getItem('USER'))
    this.gestionnaire = this.utilService.getUserById(this.idGestionnaire)

  }

  traiterTache(tabTache: Tache[]){
    this.dossiers = tabTache   
  }

  affecterTacheGestionnaire(){   
    if (this.dossiers.length == 0){
      this.toastr.error("Veuillez selectionner un/des dossier(s)")
    }
    else {
      this.dossiers.forEach(dossier => {
        dossier.idUtilisateur = this.idGestionnaire
        let pieces = this.tacheService.getPiecesByDossier(dossier.ident)
        pieces.forEach(piece => piece.idUtilisateur = this.idGestionnaire)
      });   
      this.router.navigate(['gestionBO']) 
    }
  }
}

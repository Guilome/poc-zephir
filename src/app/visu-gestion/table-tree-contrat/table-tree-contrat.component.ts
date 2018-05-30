import { Component, OnInit } from '@angular/core';
import { Contrat} from '../../shared/domain/contrat';
import { ContratService } from '../../shared/services/contrat.service';
import { Tache, Nature } from '../../shared/domain/Tache';
import { TacheService } from '../../shared/services/tache.service';
import { Router } from '@angular/router';

@Component({
  selector: 'table-tree-contrat',
  templateUrl: './table-tree-contrat.component.html',
  styleUrls: ['./table-tree-contrat.component.css']
})
export class TableTreeContratComponent implements OnInit {

  taches: Tache[]
  dossiers: Tache[]
  dossierPieces = []
  idCurrentUser;
  firstIdent;

  constructor(public contratService: ContratService, private tacheService: TacheService, private route: Router) {
    this.idCurrentUser = parseInt(localStorage.getItem('USER'));
    this.tacheService.listerTaches().subscribe(data => this.taches = data)
    this.dossiers = this.taches.filter( d => d.nature === Nature.DOSSIER && d.idUtilisateur === this.idCurrentUser && d.dateCloture == null)
  }

  ngOnInit() {    
    this.dossiers.forEach(dossier => {
      console.log(dossier)
      var lesPieces  = []
      this.taches.forEach(tache => {
        if (tache.nature === Nature.PIECE && tache.idTacheMere === dossier.ident){
          lesPieces.push(tache)
        }
      })
      this.dossierPieces.push({bool:false, dossier: dossier.ident, pieces: lesPieces})   
    })
  }

  toggleChildren(idTacheMere: number){           
    this.dossierPieces.forEach(dossierP =>{      
      if(dossierP.dossier === idTacheMere) {
        dossierP.bool = !dossierP.bool
      }
    })
    
  }

  traiterPieces(idContext, idDossier) {
    this.dossierPieces.forEach(dp => {
      if(dp.dossier === idDossier) {
        this.firstIdent = dp.pieces[0].ident
      }
    })
    this.route.navigate(['/TraitementTache', { id: idContext, piece: this.firstIdent}])
  }
}
import { Component, OnInit } from '@angular/core';
import { Contrat} from '../../shared/domain/contrat';
import { ContratService } from '../../shared/services/contrat.service';
import { Tache, Nature } from '../../shared/domain/Tache';
import { TacheService } from '../../shared/services/tache.service';

@Component({
  selector: 'table-tree-contrat',
  templateUrl: './table-tree-contrat.component.html',
  styleUrls: ['./table-tree-contrat.component.css']
})
export class TableTreeContratComponent implements OnInit {

  indexSup
  taches: Tache[]
  dossiers: Tache[]
  dossierPieces = []
  idCurrentUser;

  constructor(public contratService: ContratService, private tacheService: TacheService) {
    this.idCurrentUser = parseInt(localStorage.getItem('USER'));
    this.tacheService.listerTaches().subscribe(data => this.taches = data)
    this.dossiers = this.taches.filter( d => d.nature === Nature.DOSSIER && d.idUtilisateur === this.idCurrentUser)
  }

  ngOnInit() {
    console.log(this.dossiers.length);
    
    this.dossiers.forEach(dossier => {
      var lesPieces  = []
      this.taches.forEach(tache => {
        if (tache.nature === Nature.PIECE && tache.idTacheMere === dossier.ident){
          lesPieces.push(tache)
        }
      })
      if (lesPieces.length == 0) {
        this.indexSup = this.dossiers.indexOf(dossier)
      }
      else {
        this.dossierPieces.push({bool:false, dossier: dossier.ident, pieces: lesPieces})   
      }
    })
    this.dossiers.splice(this.indexSup, 1)
  }

  toggleChildren(idTacheMere: number){           
    this.dossierPieces.forEach(dossierP =>{      
      if(dossierP.dossier === idTacheMere) {
        dossierP.bool = !dossierP.bool
      }
    })
    
  }
}
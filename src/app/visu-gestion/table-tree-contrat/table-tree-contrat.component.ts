import { Component, OnInit } from '@angular/core';
import { Contrat} from '../../shared/domain/contrat';
import { ContratService } from '../../shared/services/contrat.service';
import { Tache } from '../../shared/domain/Tache';

@Component({
  selector: 'table-tree-contrat',
  templateUrl: './table-tree-contrat.component.html',
  styleUrls: ['./table-tree-contrat.component.css']
})
export class TableTreeContratComponent implements OnInit {

  visible: Boolean = false
  folderClass = []
  contrats: Contrat[]
  taches: Tache[]
  idCurrentUser;

  constructor(public contratService: ContratService) {
    this.idCurrentUser = parseInt(localStorage.getItem('USER'));
    this.contrats = this.contratService.getContratByIdUtilisateur(this.idCurrentUser).filter(contrat => contrat.listeTaches.length > 0) 
  }

  ngOnInit() {
    this.contrats.forEach(contrat => {
      this.folderClass.push({bool : false, id: contrat.ident})
      contrat.listeTaches.forEach(tache => {
        contrat.idContext = tache.context.ident        
      });      
    })
  }

  toggleChildren(contrat: any){   
    this.taches = contrat.listeTaches        
    this.folderClass.forEach(folder =>{
      if(folder.id == contrat.ident) {
        folder.bool = !folder.bool
      }
    })
  }
}
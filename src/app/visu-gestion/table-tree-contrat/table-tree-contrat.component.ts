import { Component, OnInit } from '@angular/core';
import { Contrat} from '../../shared/domain/contrat';
import { Tache, Nature, Status } from '../../shared/domain/Tache';
import { TacheService } from '../../shared/services/tache.service';
import { Router } from '@angular/router';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UtilisateurService } from '../../shared/services/utilisateur.service';

@Component({
  selector: 'table-tree-contrat',
  templateUrl: './table-tree-contrat.component.html',
  styleUrls: ['./table-tree-contrat.component.css']
})
export class TableTreeContratComponent implements OnInit {

  lesPieces: Tache[]
  dossiers: Tache[]
  dossierAffichage: any[] = []
  dossierPieces = []
  dossierStatut: Status
  idCurrentUser;
  firstIdent;
  //idContext
  private currentModal:NgbModalRef;

  constructor(private tacheService: TacheService, private utilisateurService: UtilisateurService, private route: Router, private modalService: NgbModal) {
    this.idCurrentUser = parseInt(localStorage.getItem('USER'));
    this.tacheService.listerTaches().subscribe(data => { 
      this.dossiers = data.filter( d => d.nature === Nature.DOSSIER && d.idUtilisateur === this.idCurrentUser && d.dateCloture == null)
     })
  }

  ngOnInit() {    
    this.dossiers.forEach(dossier => {
      this.dossierAffichage.push({ident: dossier.ident, numContrat: dossier.context.contrat.numero, 
                                  nomClient: dossier.context.nomAppelClient, nomIntermediaire: dossier.context.nomAppelIntermediaire, 
                                  status: this.tacheService.getStatutDossier(dossier.ident)})
      //this.idContext = dossier.context.ident 
      this.lesPieces = this.tacheService.getPiecesByDossier(dossier.ident)
      this.dossierPieces.push({bool:false, dossier: dossier.ident, pieces: this.lesPieces})   
    })
  }

  toggleChildren(idTacheMere: number){           
    this.dossierPieces.forEach(dossierP =>{      
      if(dossierP.dossier === idTacheMere) {
        dossierP.bool = !dossierP.bool
      }
    })    
  }

  traiterPieces(idDossier) {
    this.dossierPieces.forEach(dp => {
      if(dp.dossier === idDossier) {
        this.firstIdent = dp.pieces[0].ident
      }
    })
    const dossier = this.tacheService.getDossierById(idDossier);
    this.route.navigate(['/TraitementTache', { id: dossier.context.ident, piece: this.firstIdent}])
  }

  openModal(modal, idDossier){
    this.dossierStatut = this.tacheService.getStatutDossier(idDossier)
    this.lesPieces = this.tacheService.getPiecesByDossier(idDossier)
    this.currentModal = this.modalService.open(modal,  { size: 'lg', backdropClass: 'light-blue-backdrop', centered: true });   
  }

  closeModal(){
    this.currentModal.close();
  }

  getName(idUtilisateur){
    return this.utilisateurService.getUserById(idUtilisateur).nom
  }
}
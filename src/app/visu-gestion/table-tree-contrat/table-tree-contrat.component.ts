import { Component, OnInit } from '@angular/core';
import { Tache, Nature, Status } from '../../shared/domain/Tache';
import { TacheService } from '../../shared/services/tache.service';
import { Router } from '@angular/router';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UtilisateurService } from '../../shared/services/utilisateur.service';
import { GroupeService } from '../../shared/services/groupe.service';

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
  dossierStatut: string
  idCurrentUser;
  firstIdent;
  private currentModal:NgbModalRef;

  constructor(private tacheService: TacheService, 
              private utilisateurService: UtilisateurService, 
              private groupeService: GroupeService,
              private route: Router, 
              private modalService: NgbModal) {
    
    this.idCurrentUser = parseInt(localStorage.getItem('USER'));
    this.tacheService.listerTaches().subscribe(data => {       
      this.dossiers = data.filter( d => d.nature === Nature.DOSSIER && d.idUtilisateur === this.idCurrentUser && d.dateCloture == null)
      this.dossierAffichage = []
      this.dossiers.forEach(dossier => {
        this.lesPieces = this.tacheService.getTachesByDossier(dossier.ident).filter( pi => pi.nature === Nature.PIECE)
        this.dossierAffichage.push({ident: dossier.ident, numContrat: dossier.context.contrat.numero, codeDossier: dossier.code, produit: dossier.context.contrat.codeProduit,
                                    nomClient: dossier.context.nomAppelClient, nomIntermediaire: dossier.context.nomAppelIntermediaire,
                                    status: this.tacheService.getStatutTache(dossier), dateGedRec : dossier.dateReception.toLocaleDateString()})
        this.dossierPieces.push({bool:false, dossier: dossier.ident, pieces: this.lesPieces})   
      })
     })
  }

  ngOnInit() {    
    
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
    const dossier = this.tacheService.getTacheById(idDossier);
    this.route.navigate(['/TraitementTache', { id: dossier.context.ident, piece: this.firstIdent}])
  }

  openModal(modal, idDossier){
    this.dossierStatut = this.tacheService.getStatutTache(this.tacheService.getTacheById(idDossier))
    this.lesPieces = this.tacheService.getTachesByDossier(idDossier).filter(ta => ta.nature === Nature.PIECE)
    this.currentModal = this.modalService.open(modal,  { size: 'lg', backdropClass: 'light-blue-backdrop', centered: true });   
  }

  closeModal(){
    this.currentModal.close();
  }

  getName(idUtilisateur){
    return this.utilisateurService.getUserById(idUtilisateur).nom
  }

}
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
    let utilisateur = this.utilisateurService.getUserById(this.idCurrentUser)            
    this.tacheService.listerTaches().subscribe(data => {     
      //recupère les dossiers en fonction de l'utilisateur et si la date de cloture est non renseigné
      this.dossiers = data.filter( d => d.nature === Nature.DOSSIER && d.dateCloture == null && d.utilisateur === utilisateur)
      this.dossierAffichage = []
      this.dossiers.forEach(dossier => {
        //récupère les pièces du dossier
        this.lesPieces = this.tacheService.getPiecesByDossier(dossier.ident)
        //rempli un tableau avec les données à affiché
        this.dossierAffichage.push({ident: dossier.ident, numContrat: dossier.context.contrat.numero, groupe: this.groupeService.getGroupeById(dossier.groupe.ident).libelle, 
                                    produit: dossier.context.contrat.codeProduit, nomClient: dossier.context.nomAppelClient, code: dossier.codeTache,
                                    nomIntermediaire: dossier.context.nomAppelIntermediaire, status: this.tacheService.getStatutTache(dossier), 
                                    dateGedRec : dossier.dateReception.toLocaleDateString()})
        //liste qui continent les pièce du dossier et les données qui décide de l'affichage
        this.dossierPieces.push({bool:false, dossier: dossier.ident, pieces: this.lesPieces})   
      })
     })
  }

  ngOnInit() {    
    
  }

  /**
   * fonction qui gère le bouton plus dans la liste
   * @param idTacheMere 
   */
  toggleChildren(idTacheMere: number){           
    this.dossierPieces.forEach(dossierP =>{      
      if(dossierP.dossier === idTacheMere) {
        dossierP.bool = !dossierP.bool
      }
    })    
  }

  /**
   * Fonction qui envoie vers la page de traitement du dossier
   * @param idDossier 
   */
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
    this.dossierStatut = this.tacheService.getStatutTache(this.tacheService.getDossierById(idDossier))
    this.lesPieces = this.tacheService.getPiecesByDossier(idDossier)
    this.currentModal = this.modalService.open(modal,  { size: 'lg', backdropClass: 'light-blue-backdrop', centered: true });   
  }

  closeModal(){
    this.currentModal.close();
  }

  // retourne le nom d'un utilisateur
  getName(idUtilisateur){
    return this.utilisateurService.getUserById(idUtilisateur).nom
  }

}
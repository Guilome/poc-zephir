import { Component, OnInit } from '@angular/core';
import { Modification, Donnee } from '../../../shared/domain/modification';
import { ModificationService } from '../../../shared/services/modification.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Tache } from '../../../shared/domain/Tache';
import { TacheService } from '../../../shared/services/tache.service';
import { ActionMetierService } from '../../../shared/services/action-metier.service';

@Component({
  selector: 'app-visualiser-modification',
  templateUrl: './visualiser-modification.component.html',
  styleUrls: ['./visualiser-modification.component.css']
})
export class VisualiserModificationComponent implements OnInit {

  //Liste des modifications
  public lesModifs: Modification[] = []

  currentDossier: Tache

  
  constructor(private actionMetierService: ActionMetierService,
              private tacheService: TacheService,
              private route: ActivatedRoute,
              private modifService: ModificationService,
              private router: Router) { }

  ngOnInit() {
    this.route.params.subscribe(data => {
    this.currentDossier = this.tacheService.getPieceById(+data.id);
    });
    this.chargerListeModif();    
  }

  private chargerListeModif(){
    this.lesModifs = this.modifService.getModificationByDossier(this.currentDossier.ident)
  }

  private annulerModification(idModif: number) {
    let replaceMarque = (<HTMLInputElement>document.getElementById('marque'))
    let replaceImmat = (<HTMLInputElement>document.getElementById('immat'))
    let replaceModele = (<HTMLInputElement>document.getElementById('modele'))
    let replaceMEC = (<HTMLInputElement>document.getElementById('mec'))
    let replaceDesignation = (<HTMLInputElement>document.getElementById('designation'))
    let replaceMDA = (<HTMLInputElement>document.getElementById('mda'))
    let replaceDateAcquisition = (<HTMLInputElement>document.getElementById('dateAcquisition'))
    let modif = this.modifService.getModificationById(idModif)
    if (modif.donnee == Donnee.MARQUE_VEHICULE) {
      replaceMarque.value = modif.valeurAvant
    }
    else {
      replaceModele.value = modif.valeurAvant
    }
    this.lesModifs.forEach(m => {
      if (m.idTache) {
        
      }
    })
    this.modifService.supprimerModif(modif)
    this.chargerListeModif()    
    if (this.lesModifs.length == 0) {      
      this.actionMetierService.supprimerActionMetier(this.actionMetierService.getById(this.currentDossier.ident))
    }
  }


}
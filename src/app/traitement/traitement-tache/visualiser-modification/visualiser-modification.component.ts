import { Component, OnInit } from '@angular/core';
import { Modification, Donnee } from '../../../shared/domain/Modification';
import { ModificationService } from '../../../shared/services/modification.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Tache } from '../../../shared/domain/Tache';
import { TacheService } from '../../../shared/services/tache.service';

@Component({
  selector: 'app-visualiser-modification',
  templateUrl: './visualiser-modification.component.html',
  styleUrls: ['./visualiser-modification.component.css']
})
export class VisualiserModificationComponent implements OnInit {

  //Liste des modifications
  public lesModifs: Modification[] = []
  public dateAvant
  public dateApres

  currentDossier: Tache

  
  constructor(private tacheService: TacheService,
              private route: ActivatedRoute,
              private modifService: ModificationService,
              private router: Router) { }

  ngOnInit() {
    this.route.params.subscribe(data => {
      const userId = +localStorage.getItem('USER');
      this.currentDossier = this.tacheService.getDossierByIdContext(+data.id, userId);
    });
    this.chargerListeModif();    
  }

  private chargerListeModif(){
    this.lesModifs = this.modifService.getModificationByDossier(this.currentDossier.ident)
    this.lesModifs.forEach(m => {
      if(m.donnee == Donnee.MEC_VEHICULE){
        this.dateAvant = new Date(m.valeurAvant).toLocaleDateString()
        this.dateApres = new Date(m.valeurApres).toLocaleDateString()
      }
      else if(m.donnee == Donnee.DA_VEHICULE){
        this.dateAvant = new Date(m.valeurAvant).toLocaleDateString()
        this.dateApres = new Date(m.valeurApres).toLocaleDateString()
      }
    })
  }
  
  private annulerModification(idModif: number) {
    let modif = this.modifService.getModificationById(idModif)
    this.modifService.supprimerModif(modif)
    this.chargerListeModif()    
    if (this.lesModifs.length == 0) {      
      this.tacheService.supprimerActionMetierTemporaire();
      let idContext = this.currentDossier.context.ident
      this.router.navigate(['/TraitementTache', { id: this.currentDossier.context.ident, piece: modif.idTache }]);
    }
  }

  private showDate(modif: Modification): boolean {
    if(modif.donnee == Donnee.MEC_VEHICULE || modif.donnee == Donnee.DA_VEHICULE) {
      return true
    }else {
      return false
    }
  }
  
}
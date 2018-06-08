import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute } from '@angular/router';
import { TacheService } from '../../../../shared/services/tache.service';
import { Tache } from '../../../../shared/domain/Tache';
import { ActionMetierService } from '../../../../shared/services/action-metier.service';
import { Modification, Code } from '../../../../shared/domain/modification';
import { ModificationService } from '../../../../shared/services/modification.service';

@Component({
  selector: 'app-information-cg',
  templateUrl: './information-cg.component.html',
  styleUrls: ['./information-cg.component.css']
})
export class InformationCgComponent implements OnInit {

  public currentMarque: string
  public currentModele: string
  public lesModifsCG: Modification[] = []
  currentTache: Tache;
  change: boolean = false
  
  constructor(private actionMetierService: ActionMetierService,
              private tacheService: TacheService,
              private route: ActivatedRoute,
              private modifService: ModificationService,
              private router: Router,
              private toastr: ToastrService) { }

  ngOnInit() {
    this.route.params.subscribe(data => {
    this.currentTache = this.tacheService.getPieceById(+data.piece);
    });
    this.chargerListeModif()    
    if(this.lesModifsCG.length > 0){
      this.lesModifsCG.forEach( m => {
        if (m.code == Code.MARQUE_VEHICULE) {
          this.currentMarque = m .valeurApres
        }
        else if (m.code == Code.MODELE_VEHICULE) {
          this.currentModele = m.valeurApres
        }
      })
    }
    else {
      this.currentMarque = "BMW";
      this.currentModele = "SERIE 3";
    }
  }

  ifChangement() {
    const marque = (<HTMLInputElement>document.getElementById('marque')).value    
    const modele = (<HTMLInputElement>document.getElementById('modele')).value    
    if(marque != this.currentMarque || modele != this.currentModele) {
      this.change = true    
      this.DemandeAvt(marque, modele)
    }
  }

  DemandeAvt(marque : string, modele: string){
    this.currentTache.message = ' ';
    if(marque != this.currentMarque) {
      this.currentTache.message += 'Marque : '+ marque + '.\n'; 
      let modifCG = new Modification(this.currentTache.ident,Code.MARQUE_VEHICULE, this.currentMarque, marque)
      this.currentMarque = marque
      this.modifService.addModification(modifCG)
    }
    if (modele != this.currentModele) {
      this.currentTache.message += "Modèle : " + modele + '.\n';
      let modifCG = new Modification(this.currentTache.ident,Code.MODELE_VEHICULE, this.currentModele, modele)
      this.currentModele = modele
      this.modifService.addModification(modifCG)
    }
    this.chargerListeModif()
    this.actionMetierService.createDemandeAvt(this.currentTache);
    this.toastr.success('Une demande d\'avenant a été créée');
  }

  private titleStatus() {
    // Status 
    let idLabelStatus = document.getElementById('idLabelStatus');
    idLabelStatus.innerHTML = '<span style="color: green">OK</span>'
    for (let p of this.tacheService.getPiecesByIdContext(this.currentTache.context.ident)) {
      if(p.status === 'À vérifier') {
        idLabelStatus.innerHTML = '<span style="color: #ffc520">Vérfication</span>';
        return;
      }
      if (p.status === 'À valider') {
        idLabelStatus.innerHTML = '<span style="color: #00b3ee" >Validation</span>';
      }
    }
  }

  private chargerListeModif(){
    this.lesModifsCG = this.modifService.getModificationByPiece(this.currentTache.ident)
  }

  private annulerModification(idModif: number) {
    let replaceMarque = (<HTMLInputElement>document.getElementById('marque'))
    let replaceModele = (<HTMLInputElement>document.getElementById('modele'))
    let modif = this.modifService.getModificationById(idModif)
    if (modif.code == Code.MARQUE_VEHICULE) {
      replaceMarque.value = modif.valeurAvant
    }
    else {
      replaceModele.value = modif.valeurAvant
    }
    this.actionMetierService.supprimerActionMetier(this.actionMetierService.getById(modif.idTache))
    this.modifService.supprimerModif(modif)
    if (this.lesModifsCG.length == 0) {
      this.change = false
    }
    this.chargerListeModif()
    
  }
}

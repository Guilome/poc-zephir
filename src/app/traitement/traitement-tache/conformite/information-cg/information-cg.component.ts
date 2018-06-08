import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute } from '@angular/router';
import { TacheService } from '../../../../shared/services/tache.service';
import { Tache } from '../../../../shared/domain/Tache';
import { ActionMetierService } from '../../../../shared/services/action-metier.service';
import { Modification, Donnee } from '../../../../shared/domain/modification';
import { ModificationService } from '../../../../shared/services/modification.service';

@Component({
  selector: 'app-information-cg',
  templateUrl: './information-cg.component.html',
  styleUrls: ['./information-cg.component.css']
})
export class InformationCgComponent implements OnInit {

  //Donnee de base Form
  public currentMarque: string
  public currentImmat: string
  public currentModele: string
  public currentMEC: Date
  public currentDesignation: string
  public currentMDA: string
  public currentDA: Date
  //Liste des modifications
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
    this.chargerListeModif();    
    this.setInputValue();
  }

  ifChangement() {
    const marque = (<HTMLInputElement>document.getElementById('marque')).value    
    const immat = (<HTMLInputElement>document.getElementById('immat')).value    
    const modele = (<HTMLInputElement>document.getElementById('modele')).value    
    const mec = (<HTMLInputElement>document.getElementById('mec')).value    
    const designation = (<HTMLInputElement>document.getElementById('designation')).value    
    const mda = (<HTMLInputElement>document.getElementById('mda')).value    
    const da = (<HTMLInputElement>document.getElementById('dateAcquisition')).value    
    if(marque != this.currentMarque || immat != this.currentImmat || modele != this.currentModele || 
       new Date(mec).toLocaleDateString() != this.currentMEC.toLocaleDateString() ||
       designation != this.currentDesignation || mda != this.currentMDA || 
       new Date(da).toLocaleDateString() != this.currentDA.toLocaleDateString()) {
      
      this.change = true    
      this.DemandeAvt(marque, immat, modele, mec, designation, mda, da)
    }
  }

  DemandeAvt(marque : string, immat: string, modele: string, mec: string, designation:string, mda: string, da: string){
    let mecDate = new Date(mec).toLocaleDateString();
    let maDate = new Date(da).toLocaleDateString();
    this.currentTache.message = ' ';
    if(marque != this.currentMarque) {
      this.currentTache.message += 'Marque : '+ marque + '.\n'; 
      let modifCG = new Modification(this.currentTache.ident,Donnee.MARQUE_VEHICULE, this.currentMarque, marque)
      this.currentMarque = marque
      this.modifService.addModification(modifCG)
    }
    else if (immat != this.currentImmat) {
      this.currentTache.message += "Modèle : " + modele + '.\n';
      let modifCG = new Modification(this.currentTache.ident,Donnee.MODELE_VEHICULE, this.currentModele, modele)
      this.currentModele = modele
      this.modifService.addModification(modifCG)
    }
    else if (modele != this.currentModele) {
      this.currentTache.message += "Modèle : " + modele + '.\n';
      let modifCG = new Modification(this.currentTache.ident,Donnee.MODELE_VEHICULE, this.currentModele, modele)
      this.currentModele = modele
      this.modifService.addModification(modifCG)
    }
    else if (mecDate != this.currentMEC.toLocaleDateString()) {
      this.currentTache.message += "Modèle : " + modele + '.\n';
      let modifCG = new Modification(this.currentTache.ident,Donnee.MODELE_VEHICULE, this.currentModele, modele)
      this.currentModele = modele
      this.modifService.addModification(modifCG)
    }
    else if (designation != this.currentDesignation) {
      this.currentTache.message += "Modèle : " + modele + '.\n';
      let modifCG = new Modification(this.currentTache.ident,Donnee.MODELE_VEHICULE, this.currentModele, modele)
      this.currentModele = modele
      this.modifService.addModification(modifCG)
    }
    else if (mda != this.currentMDA) {
      this.currentTache.message += "Modèle : " + modele + '.\n';
      let modifCG = new Modification(this.currentTache.ident,Donnee.MODELE_VEHICULE, this.currentModele, modele)
      this.currentModele = modele
      this.modifService.addModification(modifCG)
    }
    else if (maDate != this.currentDA.toLocaleDateString()) {
      this.currentTache.message += "Modèle : " + modele + '.\n';
      let modifCG = new Modification(this.currentTache.ident,Donnee.MODELE_VEHICULE, this.currentModele, modele)
      this.currentModele = modele
      this.modifService.addModification(modifCG)
    }

    this.chargerListeModif()
    this.actionMetierService.createDemandeAvt(this.currentTache);
    this.toastr.success('Une demande d\'avenant a été créée');
  }

  private chargerListeModif(){
    this.lesModifsCG = this.modifService.getModificationByPiece(this.currentTache.ident)
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
    this.actionMetierService.supprimerActionMetier(this.actionMetierService.getById(modif.idTache))
    this.modifService.supprimerModif(modif)
    if (this.lesModifsCG.length == 0) {
      this.change = false
    }
    this.chargerListeModif()    
  }

  private setInputValue(){
    this.currentMarque = "BMW";
    this.currentImmat = "AB-123-CP";
    this.currentModele = "SERIE 3";
    this.currentMEC = new Date('01/01/2018'); // FORMAT : mois/jours/annee
    this.currentDesignation = "";
    this.currentMDA ="";
    this.currentDA = new Date('01/01/2018'); // FORMAT : mois/jours/annee
    //Modification par les valeurs modificaiots si existantes
    if(this.lesModifsCG.length > 0){
      this.lesModifsCG.forEach( m => {
        if (m.donnee == Donnee.MARQUE_VEHICULE) {
          this.currentMarque = m .valeurApres;
        }
        else if (m.donnee == Donnee.IMMATRICULATION_VEHICULE) {
          this.currentImmat = m.valeurApres;
        }
        else if (m.donnee == Donnee.MODELE_VEHICULE) {
          this.currentModele = m.valeurApres;
        }
        else if (m.donnee == Donnee.MEC_VEHICULE) {
          this.currentMEC = new Date(m.valeurApres); // FORMAT : mois/jours/annee
        }
        else if (m.donnee == Donnee.DESIGNATION_VEHICULE) {
          this.currentDesignation = m.valeurApres;
        }
        else if (m.donnee == Donnee.MA_VEHICULE) {
          this.currentMDA = m.valeurApres;
        }
        else if (m.donnee == Donnee.DA_VEHICULE) {
          this.currentDA = new Date(m.valeurApres);// FORMAT : mois/jours/annee
        }
      })
    }
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
}

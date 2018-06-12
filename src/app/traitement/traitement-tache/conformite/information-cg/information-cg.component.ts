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

  //Champs du Form
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
  public dateMax
  
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
    this.inputDate();
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
    let daDate = new Date(da).toLocaleDateString();
    this.currentTache.message = ' ';
    if(marque != this.currentMarque) {
      this.currentTache.message += 'Marque : '+ marque + '.\n'; 
      let modifCG = new Modification(this.currentTache.ident,Donnee.MARQUE_VEHICULE, this.currentMarque, marque)
      this.currentMarque = marque
      this.modifService.addModification(modifCG)
    }
    else if (immat != this.currentImmat) {
      this.currentTache.message += "Immatriculation : " + immat + '.\n';
      let modifCG = new Modification(this.currentTache.ident,Donnee.IMMATRICULATION_VEHICULE, this.currentImmat, immat)
      this.currentImmat = immat
      this.modifService.addModification(modifCG)
    }
    else if (modele != this.currentModele) {
      this.currentTache.message += "Modèle : " + modele + '.\n';
      let modifCG = new Modification(this.currentTache.ident,Donnee.MODELE_VEHICULE, this.currentModele, modele)
      this.currentModele = modele
      this.modifService.addModification(modifCG)
    }
    else if (mecDate != this.currentMEC.toLocaleDateString()) {
      this.currentTache.message += "Mise en circulation : " + mec + '.\n';
      let modifCG = new Modification(this.currentTache.ident,Donnee.MEC_VEHICULE, this.currentMEC.toLocaleDateString("en-US"), mec)
      this.currentMEC = new Date(mec)
      this.modifService.addModification(modifCG)
    }
    else if (designation != this.currentDesignation) {
      this.currentTache.message += "Modèle : " + modele + '.\n';
      let modifCG = new Modification(this.currentTache.ident,Donnee.DESIGNATION_VEHICULE, this.currentDesignation, designation)
      this.currentDesignation = designation
      this.modifService.addModification(modifCG)
    }
    else if (mda != this.currentMDA) {
      this.currentTache.message += "Modèle : " + modele + '.\n';
      let modifCG = new Modification(this.currentTache.ident,Donnee.MA_VEHICULE, this.currentMDA, mda)
      this.currentMDA = mda
      this.modifService.addModification(modifCG)
    }
    else if (daDate != this.currentDA.toLocaleDateString()) {
      this.currentTache.message += "Modèle : " + modele + '.\n';
      let modifCG = new Modification(this.currentTache.ident,Donnee.DA_VEHICULE, this.currentDA.toLocaleDateString("en-US"), da)
      this.currentDA = new Date(da)
      this.modifService.addModification(modifCG)
    }
    this.actionMetierService.createDemandeAvt(this.tacheService.getDossierById(this.currentTache.idTacheMere));
    this.toastr.success('Une demande d\'avenant a été créée');
  }

  private setInputValue(){
    this.currentMarque = "BMW";
    this.currentImmat = "AB-123-CP";
    this.currentModele = "SERIE 3";
    this.currentDesignation = "";
    this.currentMDA ="";
    //Changement par les valeurs de modification si existantes
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
        else if (m.donnee == Donnee.DESIGNATION_VEHICULE) {
          this.currentDesignation = m.valeurApres;
        }
        else if (m.donnee == Donnee.MA_VEHICULE) {
          this.currentMDA = m.valeurApres;
        }
      })
    }
  }

  private inputDate(){
    //Gestion date max
    var today = new Date();
    var dd: string= today.getDate().toString();
    var mm: string = (today.getMonth()+1).toString();
    var yyyy: string = today.getFullYear().toString();
    if(parseInt(dd)<10){
            dd='0'+dd;
        } 
        if(parseInt(mm)<10){
            mm='0'+mm;
        } 
    this.dateMax = yyyy+'-'+mm+'-'+dd;    
    (<HTMLInputElement>document.getElementById('mec')).setAttribute("max", this.dateMax);    
    (<HTMLInputElement>document.getElementById('dateAcquisition')).setAttribute("max", this.dateMax);        
    if(this.lesModifsCG.length > 0){
      this.lesModifsCG.forEach( m => {
        if (m.donnee == Donnee.MEC_VEHICULE) {
          this.currentMEC = new Date(m .valeurApres);
          (<HTMLInputElement>document.getElementById('mec')).value = this.currentMEC.toDateString()
        }
        else if(m.donnee == Donnee.DA_VEHICULE){
          this.currentDA = new Date(m .valeurApres);
          (<HTMLInputElement>document.getElementById('dateAcquisition')).value = this.currentDA.toDateString()
        }
      })
    }
    else {
      //Gestion date a afficher de base 
      var date = new Date("01/01/2018");// Format anglais : mois/jours/annee
      this.currentMEC = date;
      this.currentDA = date;
      let s = date.getFullYear() + '-' + '0'+(date.getMonth() + 1) +  '-'+'0' +date.getDate();       
      (<HTMLInputElement>document.getElementById('mec')).value = s;      
      (<HTMLInputElement>document.getElementById('dateAcquisition')).value = s;      
    }
  }
  
  private titleStatus() {
    // Status 
    let idLabelStatus = document.getElementById('idLabelStatus');
    idLabelStatus.innerHTML = '<span style="color: green">OK</span>'
    for (let p of this.tacheService.getPiecesByDossier(this.currentTache.idTacheMere)) {
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
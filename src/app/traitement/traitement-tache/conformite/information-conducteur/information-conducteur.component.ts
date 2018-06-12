import { Component, OnInit } from '@angular/core';
import { ActionMetierService } from '../../../../shared/services/action-metier.service';
import { Tache } from '../../../../shared/domain/Tache';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { TacheService } from '../../../../shared/services/tache.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { TraitementTacheComponent } from '../../traitement-tache.component';
import { Modification, Donnee } from '../../../../shared/domain/modification';
import { ModificationService } from '../../../../shared/services/modification.service';

@Component({
  selector: 'app-information-conducteur',
  templateUrl: './information-conducteur.component.html',
  styleUrls: ['./information-conducteur.component.css']
})
export class InformationConducteurComponent implements OnInit {

  public currentCRM: string;
  public currentCRM2: string;
  public currentDateCRM05: Date;
  public currentResp100: string;
  public currentResp50: string;
  public currentResp0: string;
  public currentVolIncendie: string;
  public currentBrisGlace: string;
  public currentStationnement: string;

  public dateMax
  currentTache: Tache;
  public lesModifsC: Modification[] = []
  change: boolean

  constructor(private actionMetierService: ActionMetierService,
              private tacheService: TacheService,
              private modifService: ModificationService,
              private route: ActivatedRoute,
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
    const crm = (<HTMLInputElement>document.getElementById('crm')).value 
    const crm2 = (<HTMLInputElement>document.getElementById('crm2')).value
    const dateCRM05 =  (<HTMLInputElement>document.getElementById('dateCrm05')).value
    const resp100 = (<HTMLInputElement>document.getElementById('resp100')).value    
    const resp50 = (<HTMLInputElement>document.getElementById('resp50')).value    
    const resp0 = (<HTMLInputElement>document.getElementById('resp0')).value    
    const volIncendie = (<HTMLInputElement>document.getElementById('vei')).value    
    const brisDeGlace = (<HTMLInputElement>document.getElementById('bdg')).value    
    const stationnement = (<HTMLInputElement>document.getElementById('sta')).value    
    if(crm.toString() != this.currentCRM || crm2.toString() != this.currentCRM2 ||
       new Date(dateCRM05).toLocaleDateString() != this.currentDateCRM05.toLocaleDateString() ||
       resp100 != this.currentResp100 || resp50 != this.currentResp50 || resp0 != this.currentResp0 ||       
       volIncendie != this.currentVolIncendie || brisDeGlace != this.currentBrisGlace ||
       stationnement != this.currentStationnement) {
      this.change = true    
      this.DemandeAvt(crm, crm2, dateCRM05, resp100, resp50, resp0, volIncendie, brisDeGlace, stationnement)
    }
  }

  DemandeAvt(crm: string, crm2: string, dateCrm05: string, resp100: string, resp50: string, resp0: string, volIncendie: string, brisDeGlace: string, stationnement: string){
    let dateCRM = new Date(dateCrm05).toLocaleDateString();
    this.currentTache.message = ' ';
    if(crm != this.currentCRM) {
      this.currentTache.message += 'CRM : '+ crm + '.\n'; 
      let modifC = new Modification(this.currentTache.ident,Donnee.CRM_CONDUCTEUR, this.currentCRM, crm)
      this.currentCRM = crm
      this.modifService.addModification(modifC)
    }
    else if (crm2 != this.currentCRM2) {
      this.currentTache.message += "CRM2 : " + crm2 + '.\n';
      let modifC = new Modification(this.currentTache.ident,Donnee.CRM2_CONDUCTEUR, this.currentCRM2, crm2)
      this.currentCRM2 = crm2
      this.modifService.addModification(modifC)
    }
    else if (dateCRM != this.currentDateCRM05.toLocaleDateString()) {
      this.currentTache.message += "Date obtention CRM 0.5 : " + dateCRM + '.\n';
      let modifC = new Modification(this.currentTache.ident,Donnee.DOCRM05_CONDUCTEUR, this.currentDateCRM05.toLocaleDateString("en-US"), dateCrm05)
      this.currentDateCRM05 = new Date(dateCrm05)
      this.modifService.addModification(modifC)
    }
    else if (resp100 != this.currentResp100) {
      this.currentTache.message += "Responsabilité 100% : " + resp100 + '.\n';
      let modifC = new Modification(this.currentTache.ident,Donnee.RESP100_CONDUCTEUR, this.currentResp100, resp100)
      this.currentResp100 = resp100
      this.modifService.addModification(modifC)
    }
    else if (resp50 != this.currentResp50) {
      this.currentTache.message += "Responsabilité 50% : " + resp50 + '.\n';
      let modifC = new Modification(this.currentTache.ident,Donnee.RESP50_CONDUCTEUR, this.currentResp50, resp50)
      this.currentResp50 = resp50
      this.modifService.addModification(modifC)
    }
    else if (resp0 != this.currentResp0) {
      this.currentTache.message += "Responsabilité 0% : " + resp0 + '.\n';
      let modifC = new Modification(this.currentTache.ident,Donnee.RESP0_CONDUCTEUR, this.currentResp0, resp0)
      this.currentResp0 = resp0
      this.modifService.addModification(modifC)
    }
    else if (volIncendie != this.currentVolIncendie) {
      this.currentTache.message += "Vol et incendie : " + volIncendie + '.\n';
      let modifC = new Modification(this.currentTache.ident,Donnee.VI_CONDUCTEUR, this.currentVolIncendie, volIncendie)
      this.currentVolIncendie = volIncendie
      this.modifService.addModification(modifC)
    }
    else if (brisDeGlace != this.currentBrisGlace) {
      this.currentTache.message += "Bris de Glace : " + brisDeGlace + '.\n';
      let modifC = new Modification(this.currentTache.ident,Donnee.BDG_CONDUCTEUR, this.currentBrisGlace, brisDeGlace)
      this.currentBrisGlace = brisDeGlace
      this.modifService.addModification(modifC)
    }
    else if (stationnement != this.currentStationnement) {
      this.currentTache.message += "Stationnement : " + stationnement + '.\n';
      let modifC = new Modification(this.currentTache.ident,Donnee.STATIONNEMENT_CONDUCTEUR, this.currentStationnement, stationnement)
      this.currentStationnement = stationnement
      this.modifService.addModification(modifC)
    }
    this.actionMetierService.createDemandeAvt(this.currentTache);
    this.toastr.success('Une demande d\'avenant a été créée');
  }

  private setInputValue(){
    this.currentCRM = "0.68";
    this.currentCRM2 = "0.6";
    this.currentResp100 = "0";
    this.currentResp50 = "0";
    this.currentResp0 = "0";
    this.currentVolIncendie = "0";
    this.currentBrisGlace = "0";
    this.currentStationnement = "0";
    //Changement par les valeurs de modification si existantes
    if(this.lesModifsC.length > 0){
      this.lesModifsC.forEach( m => {
        if (m.donnee == Donnee.CRM_CONDUCTEUR) {
          this.currentCRM = m .valeurApres;
        }
        else if (m.donnee == Donnee.CRM2_CONDUCTEUR) {
          this.currentCRM2 = m.valeurApres;
        }
        else if (m.donnee == Donnee.RESP100_CONDUCTEUR) {
          this.currentResp100 = m.valeurApres;
        }
        else if (m.donnee == Donnee.RESP50_CONDUCTEUR) {
          this.currentResp50 = m.valeurApres;
        }
        else if (m.donnee == Donnee.RESP0_CONDUCTEUR) {
          this.currentResp0 = m.valeurApres;
        }
        else if (m.donnee == Donnee.VI_CONDUCTEUR) {
          this.currentVolIncendie = m.valeurApres;
        }
        else if (m.donnee == Donnee.BDG_CONDUCTEUR) {
          this.currentBrisGlace = m.valeurApres;
        }
        else if (m.donnee == Donnee.STATIONNEMENT_CONDUCTEUR) {
          this.currentStationnement = m.valeurApres;
        }
      })
    }
  }

  inputDate(){
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
    (<HTMLInputElement>document.getElementById('dateCrm05')).setAttribute("max", this.dateMax);    
    if(this.lesModifsC.length > 0){
      this.lesModifsC.forEach( m => {
        if (m.donnee == Donnee.DATE_PERMIS) {
          this.currentDateCRM05 = new Date(m .valeurApres);
          (<HTMLInputElement>document.getElementById('dateCrm05')).value = this.currentDateCRM05.toDateString()
        }
      })
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

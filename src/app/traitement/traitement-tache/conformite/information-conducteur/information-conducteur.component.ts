import { Component, OnInit } from '@angular/core';
import { ActionMetierService } from '../../../../shared/services/action-metier.service';
import { Tache } from '../../../../shared/domain/Tache';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { TacheService } from '../../../../shared/services/tache.service';
import { Modification, Donnee } from '../../../../shared/domain/Modification';
import { ModificationService } from '../../../../shared/services/modification.service';
import { DonnerTacheComponent } from '../../../../affecter-tache/donner-tache/donner-tache.component';
import { $ } from 'protractor';

@Component({
  selector: 'app-information-conducteur',
  templateUrl: './information-conducteur.component.html',
  styleUrls: ['./information-conducteur.component.css']
})
export class InformationConducteurComponent implements OnInit {

  public currentCRM: string;
  public currentCRM2: string;
  public currentDateCRM05: string;
  public currentResp100: string;
  public currentResp50: string;
  public currentResp0: string;
  public currentVolIncendie: string;
  public currentBrisGlace: string;
  public currentStationnement: string;

  currentTache: Tache;
  public lesModifsC: Modification[] = []
  change: boolean

  constructor(private actionMetierService: ActionMetierService,
              private tacheService: TacheService,
              private modifService: ModificationService,
              private route: ActivatedRoute,
              private toastr: ToastrService) { }

  ngOnInit() {
    //Gestion date max
    var today = new Date();
    (<HTMLInputElement>document.getElementById('dateCrm05')).setAttribute("max", this.createDate(today));    
    this.route.params.subscribe(data => {
      this.currentTache = this.tacheService.getPieceById(+data.piece);
    });
    this.setInputValue();
  }

  ifChangement() {
    const crm = (<HTMLInputElement>document.getElementById('crmElementId')).value 
    const crm2 = (<HTMLInputElement>document.getElementById('crm2ElementId')).value
    const dateCRM05 =  (<HTMLInputElement>document.getElementById('dateCrm05')).value
    const resp100 = (<HTMLInputElement>document.getElementById('resp100')).value    
    const resp50 = (<HTMLInputElement>document.getElementById('resp50')).value    
    const resp0 = (<HTMLInputElement>document.getElementById('resp0')).value    
    const volIncendie = (<HTMLInputElement>document.getElementById('vei')).value    
    const brisDeGlace = (<HTMLInputElement>document.getElementById('bdg')).value    
    const stationnement = (<HTMLInputElement>document.getElementById('sta')).value    
    if(crm.toString() != this.currentCRM || crm2.toString() != this.currentCRM2 ||
       resp100 != this.currentResp100 || 
       resp50 != this.currentResp50 || resp0 != this.currentResp0 ||       
       volIncendie != this.currentVolIncendie || brisDeGlace != this.currentBrisGlace ||
       stationnement != this.currentStationnement || dateCRM05 != this.currentDateCRM05) {
      this.change = true    
      this.DemandeAvt(crm, crm2, dateCRM05, resp100, resp50, resp0, volIncendie, brisDeGlace, stationnement)       
    }
  }

  DemandeAvt(crm: string, crm2: string, dateCrm05: string, resp100: string, resp50: string, resp0: string, volIncendie: string, brisDeGlace: string, stationnement: string){
    let modifC; 
    if(crm != this.currentCRM) {
      if (this.modifService.getMotifByDonnee(Donnee.CRM_CONDUCTEUR) == null) {
        modifC = new Modification(this.currentTache.ident,Donnee.CRM_CONDUCTEUR, this.currentCRM, crm)
        this.currentCRM = crm
        this.modifService.addModification(modifC)
        this.actionMetierService.updateDemandeAvt(this.tacheService.getDossierById(this.currentTache.idTacheMere));
        this.toastr.success('Une demande d\'avenant a été créée');
      } else {
        modifC = this.modifService.getMotifByDonnee(Donnee.CRM_CONDUCTEUR);
        modifC.valeurApres = crm;
        this.toastr.success('La demande d\'avenant a été modifiée');
      }
    }
    else if (crm2 != this.currentCRM2) {
      if (this.modifService.getMotifByDonnee(Donnee.CRM2_CONDUCTEUR) == null) {
        modifC = new Modification(this.currentTache.ident,Donnee.CRM2_CONDUCTEUR, this.currentCRM2, crm2)
        this.currentCRM2 = crm2
        this.modifService.addModification(modifC)
        this.actionMetierService.updateDemandeAvt(this.tacheService.getDossierById(this.currentTache.idTacheMere));
        this.toastr.success('Une demande d\'avenant a été créée');
      } else {
        modifC = this.modifService.getMotifByDonnee(Donnee.CRM2_CONDUCTEUR);
        modifC.valeurApres = crm2;
        this.toastr.success('La demande d\'avenant a été modifiée');
      }

    }
    else if (dateCrm05 != this.currentDateCRM05) {
      if (this.modifService.getMotifByDonnee(Donnee.DOCRM05_CONDUCTEUR) == null) {
        modifC = new Modification(this.currentTache.ident,Donnee.DOCRM05_CONDUCTEUR, this.currentDateCRM05, dateCrm05)
        this.currentDateCRM05 = dateCrm05
        this.modifService.addModification(modifC)
        this.actionMetierService.updateDemandeAvt(this.tacheService.getDossierById(this.currentTache.idTacheMere));
        this.toastr.success('Une demande d\'avenant a été créée');
      } else {
        modifC = this.modifService.getMotifByDonnee(Donnee.DOCRM05_CONDUCTEUR);
        modifC.valeurApres = dateCrm05;
        this.toastr.success('La demande d\'avenant a été modifiée');
      }
    }
    else if (resp100 != this.currentResp100) {
      if (this.modifService.getMotifByDonnee(Donnee.RESP100_CONDUCTEUR) == null) {
        modifC = new Modification(this.currentTache.ident,Donnee.RESP100_CONDUCTEUR, this.currentResp100, resp100)
        this.currentResp100 = resp100
        this.modifService.addModification(modifC)
        this.actionMetierService.updateDemandeAvt(this.tacheService.getDossierById(this.currentTache.idTacheMere));
        this.toastr.success('Une demande d\'avenant a été créée');
      } else {
        modifC = this.modifService.getMotifByDonnee(Donnee.RESP100_CONDUCTEUR);
        modifC.valeurApres = resp100;
        this.toastr.success('La demande d\'avenant a été modifiée');
      }

    }
    else if (resp50 != this.currentResp50) {
      if (this.modifService.getMotifByDonnee(Donnee.RESP50_CONDUCTEUR) == null) {
        modifC = new Modification(this.currentTache.ident,Donnee.RESP50_CONDUCTEUR, this.currentResp50, resp50)
        this.currentResp50 = resp50
        this.modifService.addModification(modifC)
        this.actionMetierService.updateDemandeAvt(this.tacheService.getDossierById(this.currentTache.idTacheMere));
        this.toastr.success('Une demande d\'avenant a été créée');
      } else {
        modifC = this.modifService.getMotifByDonnee(Donnee.RESP50_CONDUCTEUR);
        modifC.valeurApres = resp50;
        this.toastr.success('La demande d\'avenant a été modifiée');
      }
    }
    else if (resp0 != this.currentResp0) {
      if (this.modifService.getMotifByDonnee(Donnee.RESP0_CONDUCTEUR) == null) {
        modifC = new Modification(this.currentTache.ident,Donnee.RESP0_CONDUCTEUR, this.currentResp0, resp0)
        this.currentResp0 = resp0
        this.modifService.addModification(modifC)
        this.actionMetierService.updateDemandeAvt(this.tacheService.getDossierById(this.currentTache.idTacheMere));
        this.toastr.success('Une demande d\'avenant a été créée');
      } else {
        modifC = this.modifService.getMotifByDonnee(Donnee.RESP0_CONDUCTEUR);
        modifC.valeurApres = resp0;
        this.toastr.success('La demande d\'avenant a été modifiée');
      }
    }
    else if (volIncendie != this.currentVolIncendie) {
      if (this.modifService.getMotifByDonnee(Donnee.VI_CONDUCTEUR) == null) {
        modifC = new Modification(this.currentTache.ident,Donnee.VI_CONDUCTEUR, this.currentVolIncendie, volIncendie)
        this.currentVolIncendie = volIncendie
        this.modifService.addModification(modifC)   
        this.actionMetierService.updateDemandeAvt(this.tacheService.getDossierById(this.currentTache.idTacheMere));
        this.toastr.success('Une demande d\'avenant a été créée');     
      }else {
        modifC = this.modifService.getMotifByDonnee(Donnee.VI_CONDUCTEUR);
        modifC.valeurApres = volIncendie;
        this.toastr.success('La demande d\'avenant a été modifiée');
      }
    }
    else if (brisDeGlace != this.currentBrisGlace) {
      if (this.modifService.getMotifByDonnee(Donnee.BDG_CONDUCTEUR) == null) {
        modifC = new Modification(this.currentTache.ident,Donnee.BDG_CONDUCTEUR, this.currentBrisGlace, brisDeGlace)
        this.currentBrisGlace = brisDeGlace
        this.modifService.addModification(modifC)
        this.actionMetierService.updateDemandeAvt(this.tacheService.getDossierById(this.currentTache.idTacheMere));
        this.toastr.success('Une demande d\'avenant a été créée');        
      }else {
        modifC = this.modifService.getMotifByDonnee(Donnee.BDG_CONDUCTEUR);
        modifC.valeurApres = brisDeGlace;
        this.toastr.success('La demande d\'avenant a été modifiée');
      }
    }
    else if (stationnement != this.currentStationnement) {
      if (this.modifService.getMotifByDonnee(Donnee.STATIONNEMENT_CONDUCTEUR) == null) {
        modifC = new Modification(this.currentTache.ident,Donnee.STATIONNEMENT_CONDUCTEUR, this.currentStationnement, stationnement)
        this.currentStationnement = stationnement
        this.modifService.addModification(modifC)
        this.actionMetierService.updateDemandeAvt(this.tacheService.getDossierById(this.currentTache.idTacheMere));
        this.toastr.success('Une demande d\'avenant a été créée');
      }else {
        modifC = this.modifService.getMotifByDonnee(Donnee.STATIONNEMENT_CONDUCTEUR);
        modifC.valeurApres = stationnement;
        this.toastr.success('La demande d\'avenant a été modifiée');
      }
    }
  }

  private setInputValue(){
    this.currentCRM = "0.68";
    this.currentCRM2 = "0.6";
    this.currentDateCRM05 = null
    this.currentResp100 = "0";
    this.currentResp50 = "0";
    this.currentResp0 = "0";
    this.currentVolIncendie = "0";
    this.currentBrisGlace = "0";
    this.currentStationnement = "0";
    //Changement par les valeurs de modification si existantes
    if(this.lesModifsC.length > 0){
      this.lesModifsC.forEach( m => {
        switch(m.donnee){
          case Donnee.CRM_CONDUCTEUR :
            this.currentCRM = m.valeurApres;
            break;
          case Donnee.CRM2_CONDUCTEUR :
            this.currentCRM2 = m.valeurApres;
            break;
          case Donnee.DOCRM05_CONDUCTEUR : 
            this.currentDateCRM05 = this.createDate(new Date(m.valeurApres));
            break;
          case Donnee.RESP100_CONDUCTEUR :
            this.currentResp100 = m.valeurApres;
            break;
          case Donnee.RESP50_CONDUCTEUR :
            this.currentResp50 = m.valeurApres;
            break;
          case Donnee.RESP0_CONDUCTEUR :
            this.currentResp0 = m.valeurApres;
            break;
          case Donnee.VI_CONDUCTEUR :
            this.currentVolIncendie = m.valeurApres;
            break;
          case Donnee.BDG_CONDUCTEUR :
            this.currentBrisGlace = m.valeurApres;
            break;
          case Donnee.STATIONNEMENT_CONDUCTEUR :
            this.currentStationnement = m.valeurApres;
            break;
        }
      })
    }
  }

  private createDate(date: Date): string {
    let dateString = "";
    dateString += date.getFullYear() +"-";
    if((date.getMonth()+1) < 10){
      dateString += "0"+(date.getMonth()+1)+"-"
    } else {
      dateString += (date.getMonth()+1)+"-"
    }
    if(date.getDate() < 10){
      dateString += "0"+date.getDate()
    } else {
      dateString += date.getDate()
    }
    return dateString
  }
}

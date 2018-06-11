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

  public currentCRM
  public currentCRM2
  currentTache: Tache;
  change: boolean

  constructor(private actionMetierService: ActionMetierService,
              private tacheService: TacheService,
              private modifService: ModificationService,
              private route: ActivatedRoute,
              private router: Router,
              private toastr: ToastrService) { }

  ngOnInit() {
    this.currentCRM = 0.68;
    this.currentCRM2 = 0.5
    this.route.params.subscribe(data => {
      this.currentTache = this.tacheService.getPieceById(+data.piece);
    });

  }

  ifChangement() {
    const crm = parseFloat((<HTMLInputElement>document.getElementById('crm')).value)    
    const crm2 = parseFloat((<HTMLInputElement>document.getElementById('crm2')).value)
    if(crm != this.currentCRM || crm2 != this.currentCRM2) {
      this.change = true    
      //this.DemandeAvt(crm, crm2)
    }
  }
  /**
   * Création automatique d'une action métier
   */
  demandeSansEffet(){

    this.actionMetierService.createSansEffet(this.currentTache);
    this.toastr.success('Une demande "SANS-EFFET" a été creé.');
    this.docSuivant();
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

  DemandeAvt(){
    const crm = +(<HTMLInputElement>document.getElementById('crmElementId')).value;
    const date2delivrance = (<HTMLInputElement>document.getElementById('date2delivrance')).value;
    this.currentTache.message = ' ';
    if(crm != this.currentCRM) {
      this.currentTache.message += 'CRM : '+ crm + '.\n'; 
    }
    if (date2delivrance != null) {
      this.currentTache.message += "Date de Délivrance : " + date2delivrance + '.\n';
    }
    this.actionMetierService.createDemandeAvt(this.currentTache);
    this.toastr.success('Une demande d\'avenant a été créée');
    this.docSuivant();
  }

  private docSuivant() {

    let idNext = 0;
    let boolTmp: boolean = false
    this.tacheService.getPiecesByDossier(this.currentTache.idTacheMere).forEach((val, index) => {
      if(boolTmp){
        idNext = val.ident;
        boolTmp = false;
      }    
      if (val.ident == this.currentTache.ident){
            boolTmp = true; 
          }

    });

    if (idNext == null || this.currentTache.ident === idNext ) {
      this.router.navigate(['/gestionBO']);
    } else {
      this.router.navigate(['/TraitementTache', { id: this.currentTache.context.ident, piece: idNext }]);
    }
  }
}

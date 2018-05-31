import { Component, OnInit } from '@angular/core';
import { ActionMetierService } from '../../../../shared/services/action-metier.service';
import { Tache } from '../../../../shared/domain/Tache';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { TacheService } from '../../../../shared/services/tache.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { TraitementTacheComponent } from '../../traitement-tache.component';

@Component({
  selector: 'app-information-conducteur',
  templateUrl: './information-conducteur.component.html',
  styleUrls: ['./information-conducteur.component.css']
})
export class InformationConducteurComponent implements OnInit {

  public currentCRM = 0.68;
  public currentDate2delivrance = '2000-01-01';
  currentTache: Tache;
  private currentModal:NgbModalRef;
  constructor(private actionMetierService: ActionMetierService,
              private tacheService: TacheService,
              private route: ActivatedRoute,
              private router: Router,
              private toastr: ToastrService,
              private modalService: NgbModal) { }

  ngOnInit() {
    this.currentCRM = 0.68;
    this.currentDate2delivrance = '2000-01-01';
    this.route.params.subscribe(data => {
      this.currentTache = this.tacheService.getPieceById(+data.piece);
      console.log(this.currentTache);
    });

  }
  ngAfterViewInit() {
    this.currentCRM = 0.68;
    this.currentDate2delivrance = '2000-01-01';
  }

  ifChangement(crm, date2delivrance):boolean {
    if(crm.value != this.currentCRM || date2delivrance.value != this.currentDate2delivrance) {
      return true;
    }
    return false;
  }

  /**
   * Création automatique d'une action métier
   */
  demandeSansEffet(){

    this.actionMetierService.create(this.currentTache);
    this.toastr.success('Une demande "SANS-EFFET" a été creé.');
    this.docSuivant();
  }
  refused(modal){
    this.currentModal = this.modalService.open(modal,  { size: 'lg', backdropClass: 'light-blue-backdrop', centered: true });
  }

  validate(crm, date2delivrance, modal) {
    if (this.ifChangement(crm, date2delivrance)) {
      this.currentModal = this.modalService.open(modal,  { size: 'lg', centered: true });
    } else {
      this.tacheService.closeTacheConforme(this.currentTache.ident);
      this.titleStatus();
      (<HTMLInputElement>document.getElementById('fieldset1')).disabled = true;
      (<HTMLInputElement>document.getElementById('fieldset2')).disabled = true;
      this.toastr.success('La piece a été validée.');
      this.docSuivant();
    }
  }
  closeModal(){
    this.currentModal.close();
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

  DemandeAvt(){
    const crm = +(<HTMLInputElement>document.getElementById('crmElementId')).value;
    const date2delivrance = (<HTMLInputElement>document.getElementById('date2delivrance')).value;
    this.currentTache.message = ' ';
    if(crm != this.currentCRM) {
      this.currentTache.message += 'CRM : '+ crm + '.\n'; 
    }
    if (date2delivrance != this.currentDate2delivrance) {
      this.currentTache.message += "Date de Délivrance : " + date2delivrance + '.\n';
    }
    this.actionMetierService.create(this.currentTache);
    this.closeModal();
    this.toastr.success('Une demande d\'avenant a été creé');
    this.docSuivant();

  }
  private docSuivant() {

    let idNext = 0;
    let boolTmp: boolean = false
    this.tacheService.getPiecesByContext(this.currentTache.context).forEach((val, index) => {
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

import { Component, OnInit } from '@angular/core';
import { Modification, Donnee } from '../../../../shared/domain/modification';
import { Tache } from '../../../../shared/domain/Tache';
import { ActionMetierService } from '../../../../shared/services/action-metier.service';
import { TacheService } from '../../../../shared/services/tache.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ModificationService } from '../../../../shared/services/modification.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-information-pc',
  templateUrl: './information-pc.component.html',
  styleUrls: ['./information-pc.component.css']
})
export class InformationPcComponent implements OnInit {
  
  public currentDate: Date
  public dateMax
  public lesModifsPC: Modification[] = []
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
    this.inputDate()     
  }

  ifChangement() {
    const date = (<HTMLInputElement>document.getElementById('date2delivrance')).value    
    if(date != this.currentDate.toISOString().slice(0,10)) {
      this.change = true    
      this.DemandeAvt(date)
    }
  }

  DemandeAvt(date : string){
    this.currentTache.message = ' ';
    if(date != this.currentDate.toISOString().slice(0,10)) {
      this.currentTache.message += 'Date : '+ date + '.\n'; 
      let modifCG = new Modification(this.currentTache.ident,Donnee.DATE_PERMIS, this.currentDate.toISOString().slice(0,10), date)
      this.currentDate = new Date(date)
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

  private chargerListeModif(){
    this.lesModifsPC = this.modifService.getModificationByPiece(this.currentTache.ident)
  }

  private annulerModification(idModif: number) {
    let replaceDate = (<HTMLInputElement>document.getElementById('date2delivrance'))
    let modif = this.modifService.getModificationById(idModif)
    if (modif.donnee == Donnee.DATE_PERMIS) {      
      replaceDate.value = modif.valeurAvant
    }
    this.actionMetierService.supprimerActionMetier(this.actionMetierService.getById(modif.idTache))
    this.modifService.supprimerModif(modif)
    if (this.lesModifsPC.length == 0) {
      this.change = false
    }
    this.chargerListeModif()    
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
    (<HTMLInputElement>document.getElementById('date2delivrance')).setAttribute("max", this.dateMax);
    
    if(this.lesModifsPC.length > 0){
      this.lesModifsPC.forEach( m => {
        if (m.donnee == Donnee.DATE_PERMIS) {
          this.currentDate = new Date(m .valeurApres);
          (<HTMLInputElement>document.getElementById('date2delivrance')).value = this.currentDate.toDateString()
        }
      })
    }
    else {
      //Gestion date a afficher de base 
      var date = new Date("05/01/2000");
      this.currentDate = date;
      let s = date.getFullYear() + '-' + '0'+(date.getMonth() + 1) +  '-'+'0' +date.getDate(); 
      (<HTMLInputElement>document.getElementById('date2delivrance')).value = s;
      
    }
  }
}

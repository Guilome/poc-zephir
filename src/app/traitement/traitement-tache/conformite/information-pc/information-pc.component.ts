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
  
  public currentNumero: string
  public currentCategorie: string
  public currentDate: Date
  public currentDepartement: string
  public currentPrefecture: string

  public dateMax
  public lesModifsPC: Modification[] = []
  currentTache: Tache;
  change: boolean = false
  
  constructor(private actionMetierService: ActionMetierService,
              private tacheService: TacheService,
              private route: ActivatedRoute,
              private modifService: ModificationService,
              private toastr: ToastrService) { }

  ngOnInit() {
    this.route.params.subscribe(data => {
    this.currentTache = this.tacheService.getPieceById(+data.piece);
    });
    this.inputDate();
    this.setInputValue();
  }

  ifChangement() {
    const numero = (<HTMLInputElement>document.getElementById('numero')).value    
    const categorie = (<HTMLInputElement>document.getElementById('categorie')).value    
    const date = (<HTMLInputElement>document.getElementById('date2delivrance')).value    
    const departement = (<HTMLInputElement>document.getElementById('departement')).value    
    const prefecture = (<HTMLInputElement>document.getElementById('prefecture')).value    
    if(numero != this.currentNumero || categorie != this.currentCategorie || 
      new Date(date).toLocaleDateString() != this.currentDate.toLocaleDateString() ||
      departement != this.currentDepartement || prefecture != this.currentPrefecture) {
      this.change = true    
      this.DemandeAvt(numero, categorie, date, departement, prefecture)
    }
  }

  DemandeAvt(numero:string, categorie:string, date: string, departement: string, prefecture: string){
    let delivranceDate = new Date(date).toLocaleDateString();
    this.currentTache.message = ' ';
    if(numero != this.currentNumero) {
      let modifPC = new Modification(this.currentTache.ident,Donnee.NUMERO_PERMIS, this.currentNumero, numero)
      this.currentNumero = numero
      this.modifService.addModification(modifPC)
    } 
    else if (categorie != this.currentCategorie) {
      let modifPC = new Modification(this.currentTache.ident,Donnee.CATEGORIE_PERMIS, this.currentCategorie, categorie)
      this.currentCategorie = categorie
      this.modifService.addModification(modifPC)
    }
    else if (delivranceDate != this.currentDate.toLocaleDateString()) {
      let modifPC = new Modification(this.currentTache.ident,Donnee.DATE_PERMIS, this.currentDate.toLocaleDateString("en-US"), date)
      this.currentDate = new Date(date)
      this.modifService.addModification(modifPC)
    }
    else if (departement != this.currentDepartement) {
      let modifPC = new Modification(this.currentTache.ident,Donnee.DEPARTEMENT_PERMIS, this.currentDepartement, departement)
      this.currentDepartement = departement
      this.modifService.addModification(modifPC)
    }
    else if (prefecture != this.currentPrefecture) {
      let modifPC = new Modification(this.currentTache.ident,Donnee.PREFECTURE_PERMIS, this.currentPrefecture, prefecture)
      this.currentPrefecture = prefecture
      this.modifService.addModification(modifPC)
    }
    this.actionMetierService.updateDemandeAvt(this.tacheService.getDossierById(this.currentTache.idTacheMere));    
    this.toastr.success('Une demande d\'avenant a été créée');
  }

  private setInputValue(){
    this.currentNumero = "P012345678";
    this.currentCategorie = "B";
    this.currentDepartement = "34";
    this.currentPrefecture = "HERAULT";
    //Changement par les valeurs de modification si existantes
    if(this.lesModifsPC.length > 0){
      this.lesModifsPC.forEach( m => {
        if (m.donnee == Donnee.NUMERO_PERMIS) {
          this.currentNumero = m .valeurApres;
        }
        else if (m.donnee == Donnee.CATEGORIE_PERMIS) {
          this.currentCategorie = m.valeurApres;
        }
        else if (m.donnee == Donnee.PREFECTURE_PERMIS) {
          this.currentPrefecture = m.valeurApres;
        }
        else if (m.donnee == Donnee.DEPARTEMENT_PERMIS) {
          this.currentDepartement = m.valeurApres;
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

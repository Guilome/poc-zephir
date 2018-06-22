import { Component, OnInit } from '@angular/core';
import { Modification, Donnee } from '../../../../shared/domain/Modification';
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
  public currentDate: string
  public currentDepartement: string
  public currentPrefecture: string

  public lesModifsPC: Modification[] = []
  currentTache: Tache;
  change: boolean = false
  
  date = new Date("05/01/2000");
  
  constructor(private actionMetierService: ActionMetierService,
              private tacheService: TacheService,
              private route: ActivatedRoute,
              private modifService: ModificationService,
              private toastr: ToastrService) { }

  ngOnInit() {
    //Gestion date max
    var today = new Date();
    (<HTMLInputElement>document.getElementById('date2delivrance')).setAttribute("max", this.createDate(today));    
    this.route.params.subscribe(data => {
    this.currentTache = this.tacheService.getPieceById(+data.piece);
    });
    this.setInputValue();
  }

  /**
   * fonction a chaque perte de focus sur un des inputs et test si il y a un changement
   */
  ifChangement() {
    const numero = (<HTMLInputElement>document.getElementById('numero')).value    
    const categorie = (<HTMLInputElement>document.getElementById('categorie')).value    
    const date = (<HTMLInputElement>document.getElementById('date2delivrance')).value    
    const departement = (<HTMLInputElement>document.getElementById('departement')).value    
    const prefecture = (<HTMLInputElement>document.getElementById('prefecture')).value    
    if(numero != this.currentNumero || categorie != this.currentCategorie || 
       date != this.currentDate || departement != this.currentDepartement || 
       prefecture != this.currentPrefecture) {
      this.change = true    
      this.DemandeAvt(numero, categorie, date, departement, prefecture)
    }
  }

  /**
   * Créer ou modifie une demande d'avenant en fonction du ou des champs modifiés
   * @param numero 
   * @param categorie 
   * @param date 
   * @param departement 
   * @param prefecture 
   */
  DemandeAvt(numero:string, categorie:string, date: string, departement: string, prefecture: string){
    let modifPC
    if(numero != this.currentNumero) {
      modifPC = new Modification(this.currentTache.ident,Donnee.NUMERO_PERMIS, this.currentNumero, numero)
      this.currentNumero = numero
      this.modifService.addModification(modifPC)
    } 
    else if (categorie != this.currentCategorie) {
      modifPC = new Modification(this.currentTache.ident,Donnee.CATEGORIE_PERMIS, this.currentCategorie, categorie)
      this.currentCategorie = categorie
      this.modifService.addModification(modifPC)
    }
    else if (date != this.currentDate) {
      modifPC = new Modification(this.currentTache.ident,Donnee.DATE_PERMIS, this.currentDate, date)
      this.currentDate = date
      this.modifService.addModification(modifPC)
    }
    else if (departement != this.currentDepartement) {
      modifPC = new Modification(this.currentTache.ident,Donnee.DEPARTEMENT_PERMIS, this.currentDepartement, departement)
      this.currentDepartement = departement
      this.modifService.addModification(modifPC)
    }
    else if (prefecture != this.currentPrefecture) {
      modifPC = new Modification(this.currentTache.ident,Donnee.PREFECTURE_PERMIS, this.currentPrefecture, prefecture)
      this.currentPrefecture = prefecture
      this.modifService.addModification(modifPC)
    }
    this.actionMetierService.updateDemandeAvt(this.tacheService.getDossierById(this.currentTache.idTacheMere));    
    this.toastr.success('Une demande d\'avenant a été créée');
  }

  /**
   * Insère les données de base dans le formulaire
   */
  private setInputValue(){
    this.currentNumero = "P012345678";
    this.currentCategorie = "B";
    this.currentDate = this.createDate(this.date);
    this.currentDepartement = "34";
    this.currentPrefecture = "HERAULT";
    //Changement par les valeurs de modification si existantes
    if(this.lesModifsPC.length > 0){
      this.lesModifsPC.forEach( m => {
        switch(m.donnee){
          case Donnee.NUMERO_PERMIS :
            this.currentNumero = m.valeurApres;
            break;
          case Donnee.CATEGORIE_PERMIS :
            this.currentCategorie = m.valeurApres;
            break;
          case Donnee.DATE_PERMIS :
            this.currentDate = m.valeurApres;
            break;
          case Donnee.PREFECTURE_PERMIS :
            this.currentPrefecture = m.valeurApres;
            break;
          case Donnee.DEPARTEMENT_PERMIS :
            this.currentDepartement = m.valeurApres;
            break;
        }
      })
    }
  }

  /**
  * Créer la date au format adéquate (mm/jj/aaaa) afin qu'elle s'affiche correctement dans le formulaire
  * @param date 
  */
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

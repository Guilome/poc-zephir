import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { UtilisateurService } from '../../shared/services/utilisateur.service';
import { Utilisateur } from '../../shared/domain/Utilisateur';
@Component({
  selector: 'app-gestionnaire',
  templateUrl: './gestionnaire.component.html',
  styleUrls: ['./gestionnaire.component.css']
})
export class GestionnaireComponent implements OnInit {

  lesGestionnaires: Utilisateur[]
  allChecked: Boolean
  returnGestionnaire:number[]  
  @Output() gestionnaireAssigner:EventEmitter<number[]> = new EventEmitter<number[]>();
  collectChecks = []
  collectGestionnaire = []

  constructor(public GestionnaireService: UtilisateurService) {     
  }

  ngOnInit() {    
    this.returnGestionnaire = []
    this.lesGestionnaires = this.GestionnaireService.getAll()
    
  }

  //Retourne l'ID des gestionnaires selectionnés
  return(){    
 
    var collectInput=document.getElementsByTagName('input')      
    for (let i = 0; i < collectInput.length; i++) {
      this.collectChecks.push(collectInput[i])
    }
    if (this.collectGestionnaire.length < 7) {
      this.collectChecks.forEach(checkbox => {
        if (checkbox.name === "gestionnaire" && checkbox.id != "all"){
          this.collectGestionnaire.push(checkbox)     
        }
      });
    }

    //Rempli la liste des ID  des gestionnaires selectionnés
    this.collectGestionnaire.forEach(tache => {
      if(tache.checked === true){
        if (this.returnGestionnaire.indexOf(tache.id) === -1) {
          console.log("add : " + tache.id);     
          this.returnGestionnaire.push(tache.id)
        }        
      }
      else{  
        if (this.returnGestionnaire.indexOf(tache.id) != -1) {      
          console.log("remove : " + tache.id);
          this.returnGestionnaire.splice(this.returnGestionnaire.indexOf(tache.id), 1)
        }
      }      
    });    
    this.gestionnaireAssigner.emit(this.returnGestionnaire)
  }

  // Retourne l'ID de tout les gestionnaires
  returnAll(){
    //Rempli la liste de l'ID de tout les gestionnaires
    if (this.returnGestionnaire.length < 7) {
      this.returnGestionnaire = []
      console.log("add all")    
      this.lesGestionnaires.forEach(tache => {
        this.returnGestionnaire.push(tache.ident)
      });
    }
    this.gestionnaireAssigner.emit(this.returnGestionnaire)
  }
}


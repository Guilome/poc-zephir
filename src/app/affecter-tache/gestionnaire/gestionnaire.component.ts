import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { UtilisateurService } from '../../shared/services/utilisateur.service';
import { Utilisateur, Profil } from '../../shared/domain/Utilisateur';
@Component({
  selector: 'app-gestionnaire',
  templateUrl: './gestionnaire.component.html',
  styleUrls: ['./gestionnaire.component.css']
})
export class GestionnaireComponent implements OnInit {

  lesGestionnaires: Utilisateur[]
  allChecked: Boolean
  gestionnaires:Utilisateur[] = []
  @Output() gestionnaireAssigner:EventEmitter<Utilisateur[]> = new EventEmitter<Utilisateur[]>();
  collectChecks = []
  collectGestionnaire = []

  constructor(public GestionnaireService: UtilisateurService) {     
  }

  ngOnInit() {    
    this.lesGestionnaires = this.GestionnaireService.getAll() 
  }

  trierListe() {
    this.lesGestionnaires = this.lesGestionnaires.filter(g => g.profil != Profil.DIRECTEUR)
  }

  //Retourne les gestionnaires selectionnés
  return(){    

    if (this.collectGestionnaire.length < 7) {
      var collectInput=document.getElementsByTagName('input')      
      for (let i = 0; i < collectInput.length; i++) {
        if(collectInput[i].type === "checkbox"){
          if (collectInput[i].name === "gestionnaire" && collectInput[i].id != "all"){
            this.collectGestionnaire.push(collectInput[i])     
          }
        }
      }
    }

    //Rempli la liste des gestionnaires selectionnés
    this.collectGestionnaire.forEach(gestionnaire => {
      if(gestionnaire.checked === true){
        this.lesGestionnaires.forEach(g =>{
          if (g.ident == gestionnaire.id) {
            if (this.gestionnaires.indexOf(g) === -1) {
              console.log("add : " + gestionnaire.id);     
              this.gestionnaires.push(g)
            }  
          }
        })
      }
      else{  
        if (this.gestionnaires.indexOf(gestionnaire) != -1) {      
          console.log("remove : " + gestionnaire.id);
          this.gestionnaires.splice(this.gestionnaires.indexOf(gestionnaire), 1)
        }
      }      
    });    
    this.gestionnaireAssigner.emit(this.gestionnaires)
  }

  // Retourne l'ID de tout les gestionnaires
  returnAll(){
    //Rempli la liste de l'ID de tout les gestionnaires
    if (this.gestionnaires.length < 7) {
      this.gestionnaires = []
      console.log("add all")    
      this.lesGestionnaires.forEach(gestionnaire => {
        this.gestionnaires.push(gestionnaire)
      });
    }
    this.gestionnaireAssigner.emit(this.gestionnaires)
  }

  isAllChecked():Boolean {

    var collectInput = document.getElementsByTagName('input');
  
    for (let i = 0; i < collectInput.length; i++) {
      if (collectInput[i].name === "tache" && collectInput[i].id != "all") {
        if (!collectInput[i].checked)
          return false;
      }
    }  
    return true;
  }
}


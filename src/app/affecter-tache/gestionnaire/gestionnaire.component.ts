import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { UtilisateurService } from '../../shared/services/utilisateur.service';
import { Utilisateur } from '../../shared/domain/Utilisateur';
import { ProfilCode } from '../../shared/domain/profil'
import { GroupeService } from '../../shared/services/groupe.service';
@Component({
  selector: 'app-gestionnaire',
  templateUrl: './gestionnaire.component.html',
  styleUrls: ['./gestionnaire.component.css']
})
export class GestionnaireComponent implements OnInit {

  idGroupe: number
  lesGestionnaires: Utilisateur[]
  allChecked: Boolean
  gestionnaires:Utilisateur[] = []
  checkboxGest: boolean;
  @Output() gestionnaireAssigner:EventEmitter<Utilisateur[]> = new EventEmitter<Utilisateur[]>();
  collectGestionnaire = []

  constructor(public gestionnaireService: UtilisateurService,
              public groupeService:GroupeService) {  

  }

  ngOnInit() {  
    this.idGroupe = parseInt(localStorage.getItem("GROUPE"))
    this.lesGestionnaires = this.gestionnaireService.getAll() 
    this.trierListe()   
  }

  trierListe() {
    this.lesGestionnaires = this.lesGestionnaires.filter(g => g.profil.code != ProfilCode.DIRECTEUR && this.groupeService.getGroupesUtilisateur(g.ident)
                                                 .find(groupe => groupe.ident == this.idGroupe))
  }

  //Retourne les gestionnaires selectionnés
  return(){    

    if (this.collectGestionnaire.length < 7) {
      var collectInput=document.getElementsByTagName('input')      
      for (let i = 0; i < collectInput.length; i++) {
        if(collectInput[i].type === "checkbox"){
          if (collectInput[i].name === "gestionnaires" && collectInput[i].id != "allGest" && collectInput[i].id != "allDossier"){
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
              this.gestionnaires.push(g)
            }  
          }
        })
      }
      else{  
        if (this.gestionnaires.indexOf(gestionnaire) != -1) {      
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
      this.lesGestionnaires.forEach(gestionnaire => {
        this.gestionnaires.push(gestionnaire)
      });
    }
    this.gestionnaireAssigner.emit(this.gestionnaires)
  }

  isAllGest():Boolean {

    var collectInput = document.getElementsByTagName('input');
  
    for (let i = 0; i < collectInput.length; i++) {
      if (collectInput[i].name === "gestionnaires" && collectInput[i].id == "allGest" && collectInput[i].id != "allDossier") {
        if (!collectInput[i].checked)
          return false;
      }
    }  
    return true;
  }
}


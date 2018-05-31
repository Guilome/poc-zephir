import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { TacheService } from '../../shared/services/tache.service';
import { Tache, Nature } from '../../shared/domain/Tache';
import { LowerCasePipe } from '@angular/common';

@Component({
  selector: 'app-tache-non-affecte',
  templateUrl: './tache-non-affecte.component.html',
  styleUrls: ['./tache-non-affecte.component.css']
})
export class TacheNonAffecteComponent implements OnInit {

  lesDossiers:Tache[]
  allChecked: Boolean
  dossiers:Tache[] = []
  @Output() tacheAssigner:EventEmitter<Tache[]> = new EventEmitter<Tache[]>();
  collectDossier = []

  constructor(public tacheService: TacheService) {
    this.tacheService.listerTaches().subscribe(data => this.lesDossiers = data)
    this.trierListe()
  }

  ngOnInit() {
  }  

  trierListe() {
    this.lesDossiers = this.lesDossiers.filter(t => t.idUtilisateur == null && t.nature === Nature.DOSSIER)
  }

  //Retourne les tâches non affectées et selectionnées
  return(){   

    if (this.collectDossier.length < 7) {
      var collectInput=document.getElementsByTagName('input')      
      for (let i = 0; i < collectInput.length; i++) {
        if(collectInput[i].type === "checkbox"){
          if (collectInput[i].name === "dossiers" && collectInput[i].id != "allDossier" && collectInput[i].id != "allGest"){
            this.collectDossier.push(collectInput[i])            
          }
        }
      }
    }

    //Rempli la liste des tâches selectionnées
    this.collectDossier.forEach(tache => {
      if(tache.checked === true){
        this.lesDossiers.forEach(t => { 
          if (t.ident == tache.id) {    
            if (this.dossiers.indexOf(t) === -1) {
              this.dossiers.push(t)                      
            }   
          }
        });
      }
      else{
        if (this.dossiers.indexOf(tache) != -1) {      
          this.dossiers.splice(this.dossiers.indexOf(tache), 1)
        }
      }      
    });
    this.tacheAssigner.emit(this.dossiers)
  }

  // Retourne l'ID de toutes les tâches non affectées
  returnAll(){
    //Rempli la liste de l'ID de toute les tâches
    if (this.dossiers.length < 7) {
      this.dossiers = []
      this.lesDossiers.forEach(tache => {
        this.dossiers.push(tache)
        console.log(tache.libelle)        
      });
    }
    this.tacheAssigner.emit(this.dossiers)
  }

  isAllDossiers():Boolean {

    var collectInput = document.getElementsByTagName('input');
  
    for (let i = 0; i < collectInput.length; i++) {
      if (collectInput[i].name === "dossiers" && collectInput[i].id == "allDossier" && collectInput[i].id != "allGest") {
        if (!collectInput[i].checked)
          return false;
      }
    }  
    return true;
  }
}


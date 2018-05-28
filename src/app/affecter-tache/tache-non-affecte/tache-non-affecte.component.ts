import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { TacheService } from '../../shared/services/tache.service';
import { Tache } from '../../shared/domain/Tache';
import { LowerCasePipe } from '@angular/common';

@Component({
  selector: 'app-tache-non-affecte',
  templateUrl: './tache-non-affecte.component.html',
  styleUrls: ['./tache-non-affecte.component.css']
})
export class TacheNonAffecteComponent implements OnInit {

  lesTaches:Tache[]
  allChecked: Boolean
  taches:Tache[] = []
  @Output() tacheAssigner:EventEmitter<Tache[]> = new EventEmitter<Tache[]>();
  collectTache = []

  constructor(public tacheService: TacheService) {
    this.tacheService.listerTaches().subscribe(data => this.lesTaches = data)
    this.trierListe()
  }

  ngOnInit() {
  }  

  trierListe() {
    this.lesTaches = this.lesTaches.filter(t => t.idUtilisateur == null)
  }

  //Retourne les tâches non affectées et selectionnées
  return(){   

    if (this.collectTache.length < 7) {
      var collectInput=document.getElementsByTagName('input')      
      for (let i = 0; i < collectInput.length; i++) {
        if(collectInput[i].type === "checkbox"){
          if (collectInput[i].name === "tache" && collectInput[i].id != "allTache" && collectInput[i].id != "allGest"){
            this.collectTache.push(collectInput[i])            
          }
        }
      }
    }

    //Rempli la liste des tâches selectionnées
    this.collectTache.forEach(tache => {
      if(tache.checked === true){
        this.lesTaches.forEach(t => { 
          if (t.ident == tache.id) {    
            if (this.taches.indexOf(t) === -1) {
              this.taches.push(t)                      
            }   
          }
        });
      }
      else{
        if (this.taches.indexOf(tache) != -1) {      
          this.taches.splice(this.taches.indexOf(tache), 1)
        }
      }      
    });
    this.tacheAssigner.emit(this.taches)
  }

  // Retourne l'ID de toutes les tâches non affectées
  returnAll(){
    //Rempli la liste de l'ID de toute les tâches
    if (this.taches.length < 7) {
      this.taches = []
      this.lesTaches.forEach(tache => {
        this.taches.push(tache)
      });
    }
    this.tacheAssigner.emit(this.taches)
  }

  isAllTaches():Boolean {

    var collectInput = document.getElementsByTagName('input');
  
    for (let i = 0; i < collectInput.length; i++) {
      if (collectInput[i].name === "tache" && collectInput[i].id != "allTache" && collectInput[i].id != "allGest") {
        if (!collectInput[i].checked)
          return false;
      }
    }  
    return true;
  }
}


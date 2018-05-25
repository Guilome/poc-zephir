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
  returnTaches:number[]
  @Output() tacheAssigner:EventEmitter<number[]> = new EventEmitter<number[]>();
  collectChecks = []
  collectTache = []

  constructor(public tacheService: TacheService) {
    this.tacheService.listerTaches().subscribe(data => this.lesTaches = data)
    this.trierListe()
  }

  ngOnInit() {
    this.returnTaches = []
  }  

  trierListe() {
    this.lesTaches = this.lesTaches.filter(t => t.idUtilisateur == null)
  }

  //Retourne l'ID des tâches non affectées et selectionnées
  return(){    

    var collectInput=document.getElementsByTagName('input')      
    for (let i = 0; i < collectInput.length; i++) {
      this.collectChecks.push(collectInput[i])
    }
    if (this.collectTache.length < 7) {
      this.collectChecks.forEach(checkbox => {
        if (checkbox.name === "tache" && checkbox.id != "all"){
          this.collectTache.push(checkbox)     
        }
      });
    }

    //Rempli la liste des ID des tâches selectionnées
    this.collectTache.forEach(tache => {
      if(tache.checked === true){
        if (this.returnTaches.indexOf(tache.id) === -1) {
          console.log("add : " + tache.id);     
          this.returnTaches.push(tache.id)
        }        
      }
      else{  
        if (this.returnTaches.indexOf(tache.id) != -1) {      
          console.log("remove : " + tache.id);
          this.returnTaches.splice(this.returnTaches.indexOf(tache.id), 1)
        }
      }      
    });
    this.tacheAssigner.emit(this.returnTaches)
  }

  // Retourne l'ID de toutes les tâches non affectées
  returnAll(){
    //Rempli la liste de l'ID de toute les tâches
    if (this.returnTaches.length < 7) {
      this.returnTaches = []
      console.log("add all")    
      this.lesTaches.forEach(tache => {
        this.returnTaches.push(tache.ident)
      });
    }
    this.tacheAssigner.emit(this.returnTaches)
  }

  isAllChecked():Boolean{
    // Boolean qui contient la valeur de la checkbox global
    let checkGlobal: Boolean
    // Tableau de Boolean qui contient la valeur des cehckbox des tâches
    let checks: Boolean[] = []
    // Récupération des valeurs des checkbox
    var collectInput = document.getElementsByTagName('input')    
    for (let i = 0; i < collectInput.length; i++) {
      if(collectInput[i].id === "all"){
        checkGlobal = collectInput[i].checked     
      }
      if (collectInput[i].name === "tache" && collectInput[i].id != "all"){
        checks.push(collectInput[i].checked)
      }      
    }      
    
    if(checks.includes(false)){
      checkGlobal = false
      this.allChecked = false
      console.log("if false :" + checkGlobal);   
    }
    else{
      checkGlobal = true
      this.allChecked = true
      console.log("if true :" + checkGlobal);   
    }

    return this.allChecked
  }
}


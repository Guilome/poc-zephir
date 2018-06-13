import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { TacheService } from '../../shared/services/tache.service';
import { Tache, Nature } from '../../shared/domain/Tache';
import { UtilisateurService } from '../../shared/services/utilisateur.service';
import { GroupeService } from '../../shared/services/groupe.service';

@Component({
  selector: 'app-tache-non-affecte',
  templateUrl: './tache-non-affecte.component.html',
  styleUrls: ['./tache-non-affecte.component.css']
})
export class TacheNonAffecteComponent implements OnInit {

  lesDossiers:Tache[]
  allChecked: Boolean
  dossiers:Tache[] = []
  checkboxDossier: boolean;
  idGroupe: number;
  @Output() tacheAssigner:EventEmitter<Tache[]> = new EventEmitter<Tache[]>();
  collectDossier = []

  constructor(private  tacheService: TacheService,
              private groupeService: GroupeService) {
    this.tacheService.listerTaches().subscribe(data => this.lesDossiers = data)
    this.trierListe()
  }

  ngOnInit() {
    this.idGroupe = parseInt(localStorage.getItem("GROUPE"))
  }  

  trierListe() {
    this.lesDossiers = this.lesDossiers.filter(t => t.idUtilisateur == null && t.nature === Nature.DOSSIER);
    /* S'il appartient à aucun de ces deux groupes il verra tous les dossiers */
    const idUser = +localStorage.getItem('USER');
    if ( this.groupeService.isVerification(idUser)){
      this.lesDossiers = this.lesDossiers
                        .filter(dos => 
                                      this.statutDossier(dos.ident) == 'À vérifier');
    } else if (this.groupeService.isValidation(idUser)){
      this.lesDossiers = this.lesDossiers.filter(dos => this.statutDossier(dos.ident) == 'À valider');
    }
  }

  //Retourne les tâches non affectées et selectionnées
  return(){   
    this.dossiers = []
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
    if ((<HTMLInputElement> document.getElementById('allDossier')).checked) {
      //Rempli la liste de l'ID de toute les tâches
      if (this.dossiers.length < 7) {
        this.dossiers = []
        this.lesDossiers.forEach(tache => {
          this.dossiers.push(tache)
        });
      }
    }
    else {
      this.dossiers = []
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

  statutDossier(idDossier: number): string {
    return this.tacheService.getStatutDossier(idDossier);
  }
}


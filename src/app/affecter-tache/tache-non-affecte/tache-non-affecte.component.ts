import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { TacheService } from '../../shared/services/tache.service';
import { Tache, Nature, Status } from '../../shared/domain/Tache';
import { UtilisateurService } from '../../shared/services/utilisateur.service';
import { GroupeService } from '../../shared/services/groupe.service';
import { Statement } from '@angular/compiler';

@Component({
  selector: 'app-tache-non-affecte',
  templateUrl: './tache-non-affecte.component.html',
  styleUrls: ['./tache-non-affecte.component.css']
})
export class TacheNonAffecteComponent implements OnInit {

  collectDossier = []
  lesDossiers:Tache[]
  dossiers:Tache[] = []
  private tousLesDossiers: Tache[] = [];

  allChecked: Boolean
  checkboxDossier: boolean;

  idGroupe: number;
  idUser: number;

  @Output() tacheAssigner:EventEmitter<Tache[]> = new EventEmitter<Tache[]>();

  constructor(private  tacheService: TacheService,
              private utilisateurService: UtilisateurService) {
    this.idUser = +localStorage.getItem('USER');
    this.idGroupe = parseInt(localStorage.getItem("GROUPE"))
    // Constitue la liste des taches à afficher sur l'écran d'attribution ou de distribution des tâches
    if(isNaN(this.idGroupe)){
      this.tacheService.listerTaches().subscribe(data => {
        this.lesDossiers = data;  
      });
      this.lesDossiers = this.lesDossiers.filter(tache => this.utilisateurService.getUserById(this.idUser).profil.groupes.find(g => g == tache.idGroupe));
    } else {
      this.tacheService.listerTaches().subscribe(data => {
        this.lesDossiers = data;
      });
      this.lesDossiers = this.lesDossiers.filter(tache => tache.idGroupe == this.idGroupe) 
    }
    this.tousLesDossiers = this.lesDossiers
    this.trierListe()
  }

  ngOnInit() {
  }  
  
  trierListe() {
    this.lesDossiers = this.lesDossiers.filter(t => t.idUtilisateur == null && t.nature === Nature.DOSSIER && this.tacheService.getStatutTache(t) != Status.OK);
  }
  

  /**
   * Retourne les tâches selectionnées
   */
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

  /**
   * Retourne toutes les tâches
   */
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

  /**
   * Fonction de gestion des checkbox
   */
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
    return this.tacheService.getStatutTache(this.tacheService.getDossierById(idDossier));
  }

  onKeyUpFilter($event){
    const value =  $event.target.value;
    if ( value === '' ){
      this.lesDossiers = this.tousLesDossiers;
    }else {
      this.lesDossiers = this.tousLesDossiers.filter( dos => dos.context.contrat.numero.toLowerCase().indexOf(value.toLowerCase()) >= 0 );
    }
  }

  statutFilter(enAttente, aVerifier, aValider, ok) {
    if( enAttente.checked || aVerifier.checked  || aValider.checked || ok.checked ){    
      this.lesDossiers = this.tousLesDossiers.filter( dos =>                                                  
        (enAttente.checked ? this.tacheService.getStatutTache(dos) === 'En attente' : false) ||
        (aVerifier.checked ? this.tacheService.getStatutTache(dos) === 'À vérifier'   : false) ||
        (aValider.checked  ? this.tacheService.getStatutTache(dos) === 'À valider'    : false) || 
        (ok.checked ? this.tacheService.getStatutTache(dos) === 'Ok' : false)
      );
    } else {
      this.lesDossiers = this.tousLesDossiers;
    }
  }

  produitFilter($event) {
    const value =  $event.target.value;
    if ( value === '' ){
      this.lesDossiers = this.tousLesDossiers;
    }else {
        this.lesDossiers = this.tousLesDossiers.filter( dos => dos.context.contrat.codeProduit.toLowerCase().indexOf(value.toLowerCase()) >= 0 );
    }
  }

  private boolSortDate: boolean = true;

  sortByDate(thDate) {
    if(this.boolSortDate){
    this.lesDossiers = this.tousLesDossiers.sort(this.sortDateCroissant);
    } else {
      this.lesDossiers = this.tousLesDossiers.sort(this.sortDateDeCroissant);
    }
    this.boolSortDate = !this.boolSortDate;
    thDate.innerHTML = this.boolSortDate ? 'Date <i class="fa fa-sort-down"></i>' : 'Date <i class="fa fa-sort-up"></i>'
    
  }

  private sortDateCroissant = (dos1,dos2) => {
    if ( dos1.dateReception == dos2.dateReception )
        return 0;
    else if  (dos1.dateReception < dos2.dateReception) 
        return 1;
      else
    return -1;
  }

  private sortDateDeCroissant = (dos1,dos2) => {
    if ( dos1.dateReception == dos2.dateReception )
        return 0;
    else if  (dos1.dateReception < dos2.dateReception) 
        return -1;
      else
    return 1;
  }

  bannetteFilter(enAttente, aVerifier, aValider, ok): void {
      // plus tard 
  }
}


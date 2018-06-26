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
              private utilisateurService: UtilisateurService,
              private groupeService: GroupeService) {
    this.idUser = +localStorage.getItem('USER');
    this.idGroupe = parseInt(localStorage.getItem("GROUPE"))
    this.lesDossiers = this.tacheService.getTacheEncours().filter(t => t.nature == Nature.DOSSIER)
    // Constitue la liste des taches à afficher sur l'écran d'attribution ou de distribution des tâches
    if(isNaN(this.idGroupe)){
      this.lesDossiers = this.lesDossiers.filter(tache => this.utilisateurService.getUserById(this.idUser).profil.groupes.find(g => g == tache.groupe.ident));
    } else {
      this.lesDossiers = this.lesDossiers.filter(tache => tache.groupe == this.groupeService.getGroupeById(this.idGroupe)) 
    }
    this.tousLesDossiers = this.lesDossiers
    this.trierListe()
  }

  ngOnInit() {
  }  
  
  trierListe() {
    console.log(this.lesDossiers)
    this.lesDossiers = this.lesDossiers.filter(t => t.utilisateur == null && this.tacheService.getStatutTache(t) != Status.OK);
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
        (enAttente.checked ? this.tacheService.getStatutTache(dos) === Status.EN_ATTENTE : false) ||
        (aVerifier.checked ? this.tacheService.getStatutTache(dos) === Status.A_VERIFIER   : false) ||
        (aValider.checked  ? this.tacheService.getStatutTache(dos) === Status.A_VALIDER    : false) || 
        (ok.checked ? this.tacheService.getStatutTache(dos) === Status.OK : false)
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

  private boolSortProduit: boolean = true;  

  sortByProduit(divProduit){
    if(this.boolSortDate){
      this.lesDossiers = this.tousLesDossiers.sort(this.sortProduitA);
    } else {
      this.lesDossiers = this.tousLesDossiers.sort(this.sortProduitNA);
    }
    this.boolSortProduit = !this.boolSortProduit;
    divProduit.innerHTML = this.boolSortProduit ? '<i class="fa fa-sort-down"></i>' : '<i class="fa fa-sort-up"></i>'    
  }
  
  private sortProduitA = (dos1,dos2) => {
    if ( dos1.context.contrat.codeProduit === dos2.context.contrat.codeProduit )
      return 0;
    else if  (dos1.context.contrat.codeProduit < dos2.context.contrat.codeProduit) 
      return 1;
    else
      return -1;
  }
  
  private sortProduitNA = (dos1,dos2) => {
    if ( dos1.context.contrat.codeProduit === dos2.context.contrat.codeProduit )
      return 0;
    else if  (dos1.context.contrat.codeProduit < dos2.context.contrat.codeProduit) 
      return -1;
    else
      return 1;
  }

  private boolSortNumero: boolean = true; 

  sortByNumDossier(divNumDossier){
    if(this.boolSortNumero){
      this.lesDossiers = this.tousLesDossiers.sort(this.sortNumeroCroissant);
    } else {
      this.lesDossiers = this.tousLesDossiers.sort(this.sortNumeroDecroissant);
    }
    this.boolSortNumero = !this.boolSortNumero;
    divNumDossier.innerHTML = this.boolSortNumero ?'<i class="fa fa-sort-down"></i>' : '<i class="fa fa-sort-up"></i>'    
  }

  private sortNumeroCroissant = (dos1,dos2) => {
    if ( dos1.context.contrat.numero === dos2.context.contrat.numero )
      return 0;
    else if  (dos1.context.contrat.numero < dos2.context.contrat.numero) 
      return 1;
    else
      return -1;
  }
  
  private sortNumeroDecroissant = (dos1,dos2) => {
    if ( dos1.context.contrat.numero === dos2.context.contrat.numero )
      return 0;
    else if  (dos1.context.contrat.numero < dos2.context.contrat.numero) 
      return -1;
    else
      return 1;
  }

  bannetteFilter(enAttente, aVerifier, aValider, ok): void {
      // plus tard 
  }
}


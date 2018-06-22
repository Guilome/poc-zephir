import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { GroupeService } from '../shared/services/groupe.service';
import { TitreService } from '../shared/services/titre.service';
import { GraphiqueEnCoursComponent } from './graphique-en-cours/graphique-en-cours.component';
import { Status, Nature } from '../shared/domain/Tache';
import { TacheService } from '../shared/services/tache.service';
import { UtilisateurService } from '../shared/services/utilisateur.service';
import { ProfilCode } from '../shared/domain/Profil';
import { GraphiqueTermineComponent } from './graphique-termine/graphique-termine.component';

@Component({
  selector: 'app-visu-superviseur',
  templateUrl: './visu-superviseur.component.html',
  styleUrls: ['./visu-superviseur.component.css']
})
export class VisuSuperviseurComponent implements OnInit {

  idGroupe: number
  public detail: boolean = false
  public filtre: string

  //TABLEAU
  dossiersEncours = []
  dossierTermine = []
  gestionnaires = []
  statuts: Status[] = [Status.A_VALIDER, Status.A_VERIFIER, Status.EN_ATTENTE]
  produits = []
  dossierDetail = []
  entetes = []

  @ViewChild(GraphiqueEnCoursComponent) graphEnCours;
  @ViewChild(GraphiqueTermineComponent) filtreDate;

  constructor(private route: Router, 
              private activeRoute: ActivatedRoute, 
              private titreService: TitreService, 
              private tacheService: TacheService,
              private utilisateurService: UtilisateurService,
              private groupeService: GroupeService) { 
  }

  ngOnInit() {
    this.idGroupe = parseInt(this.activeRoute.snapshot.paramMap.get("id"))
    localStorage.setItem("GROUPE", this.idGroupe.toString());
    this.titreService.updateTitre("Bannette " + this.groupeService.getGroupeById(this.idGroupe).libelle.toLowerCase())
    this.dossierTermine = this.tacheService.getDossierTermine();
    this.dossiersEncours = this.tacheService.getTacheEncours().filter(dossier => dossier.nature == Nature.DOSSIER && dossier.groupe.ident == this.idGroupe);
    this.gestionnaires = this.utilisateurService.getAll().filter(utilisateur => utilisateur.profil.groupes.find( g => g == this.idGroupe))
    this.dossiersEncours.forEach(d => {
      if (this.produits.length == 0) {
        this.produits.push({nom: d.context.contrat.codeProduit})        
      } else {
        this.produits.forEach(p => {
          if(p.nom != d.context.contrat.codeProduit){
            this.produits.push({nom: d.context.contrat.codeProduit})
          }
        })
      }
    })
    console.log(this.dossiersEncours);
    
  }

  /**
   * fonction qui se lance au clic sur le bouton détails des taches en cours
   * @param bool 
   */
  afficherTab(bool: boolean){
    this.filtre = this.graphEnCours.filtreGraph
    this.detail = bool; 
    this.gestionTableau()
  }

  /**
   * fonction qui se lance au clic sur le bouton détails des taches terminées
   * @param bool 
   */
  afficherTabCloture(bool: boolean){
    this.filtre = "termine"
    this.detail = bool; 
    this.gestionTableau()
  }

  ifConnexion(): boolean {
    if (this.route.url === '/Connexion')
      return true;    
    return localStorage.getItem('USER') != null;
  }

  /**
   * Envoie vers la page de traitement d'un dossier
   * @param idDossier 
   */
  traiterPieces(idDossier) {
    let firstIdent = null
    this.tacheService.getPiecesByDossier(idDossier).forEach(dp => {
      if(firstIdent == null){
        firstIdent = dp.ident
      }
    })
    const dossier = this.tacheService.getDossierById(idDossier);
    this.route.navigate(['/TraitementTache', { id: dossier.context.ident, piece: firstIdent}])
  }

  /**
   * fonction qui affiche en fonction d'un filtre (gestionnaire / statut / prosuit / termine)
   */
  gestionTableau(){
    this.dossierDetail = []
    this.entetes = []
    switch(this.filtre) {
      case "gestionnaire":
        this.gestionnaires.filter(g => g.profil.code != ProfilCode.DIRECTEUR).forEach(g => {
          if (this.dossiersEncours.find(d => d.idUtilisateur == g.ident)) {
            this.entetes.push({
              nom: g.nom,
              prenom: g.prenom
            })
          }
        })
        if (this.dossiersEncours.find(d => d.idUtilisateur == null)) {
          this.entetes.push({nom: "Non affectées", prenom: ""})
        }
        this.dossiersEncours.forEach(d => {          
          this.dossierDetail.push({
            ident: d.ident,
            code: d.code,
            numContrat: d.context.contrat.numero,
            produit: d.context.contrat.codeProduit,
            client: d.context.nomAppelClient,
            intermediaire: d.context.nomAppelIntermediaire,
            dateGed : d.dateReception.toLocaleDateString(),            
            utilisateur : d.idUtilisateur == null ? 'Non affectées': this.utilisateurService.getName(d.idUtilisateur),
            statusDossier: this.tacheService.getStatutTache(d)
          })
        })
        break;
      case "statut":
        this.entetes = this.statuts
        this.dossiersEncours.forEach(d => {          
          this.dossierDetail.push({
            ident: d.ident,
            code: d.code,
            numContrat: d.context.contrat.numero,
            produit: d.context.contrat.codeProduit,
            client: d.context.nomAppelClient,
            intermediaire: d.context.nomAppelIntermediaire,
            dateGed : d.dateReception.toLocaleDateString(),            
            utilisateur : d.idUtilisateur == null ? 'Non affectées': this.utilisateurService.getName(d.idUtilisateur),
            statusDossier: this.tacheService.getStatutTache(d)
          })
        })
        break;
      case "produit":
        this.entetes = this.produits
        this.dossiersEncours.forEach(d => {      
          this.dossierDetail.push({
            ident: d.ident,
            code: d.code,
            numContrat: d.context.contrat.numero,
            produit: d.context.contrat.codeProduit,
            client: d.context.nomAppelClient,
            intermediaire: d.context.nomAppelIntermediaire,
            dateGed : d.dateReception.toLocaleDateString(),            
            utilisateur : d.idUtilisateur == null ? 'Non affectées': this.utilisateurService.getName(d.idUtilisateur),
            statusDossier: this.tacheService.getStatutTache(d)
          })
        })
        break;
      case "termine":
        let dossierFiltre = this.filtreDate.dossiersTermine
        this.entetes.push({nom:"Dossier Terminé", statut:"Ok"})
        dossierFiltre.forEach(d => {      
          this.dossierDetail.push({
            ident: d.ident,
            code: d.code,
            numContrat: d.context.contrat.numero,
            produit: d.context.contrat.codeProduit,
            client: d.context.nomAppelClient,
            intermediaire: d.context.nomAppelIntermediaire,
            dateGed : d.dateReception.toLocaleDateString(),            
            utilisateur : d.idUtilisateur == null ? ' ': this.utilisateurService.getName(d.idUtilisateurCloture),
            statusDossier: this.tacheService.getStatutTache(d)
          })
        })    
        break;
    }    
  }
}

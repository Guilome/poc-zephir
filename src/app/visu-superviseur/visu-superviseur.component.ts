import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { GroupeService } from '../shared/services/groupe.service';
import { TitreService } from '../shared/services/titre.service';
import { GraphiqueEnCoursComponent } from './graphique-en-cours/graphique-en-cours.component';
import { Tache, Status } from '../shared/domain/Tache';
import { TacheService } from '../shared/services/tache.service';
import { UtilisateurService } from '../shared/services/utilisateur.service';
import { Utilisateur } from '../shared/domain/Utilisateur';
import { ProfilCode } from '../shared/domain/Profil';

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
  dossiers: Tache[]
  gestionnaires: Utilisateur[]
  statuts: Status[] = [Status.A_VALIDER, Status.A_VERIFIER, Status.EN_ATTENTE]
  produits = []
  dossierDetail = []
  entetes = []

  @ViewChild(GraphiqueEnCoursComponent) graphEnCours;

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
    this.dossiers = this.tacheService.getDossierEncours().filter(dossier => dossier.idGroupe == this.idGroupe);
    this.gestionnaires = this.utilisateurService.getAll()
        .filter(utilisateur => this.groupeService.getGroupesUtilisateur(utilisateur.ident)
        .find(g => g.ident == this.idGroupe));
    this.dossiers.forEach(d => {
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
  }

  afficherTab(bool: boolean){
    this.detail = bool; 
    this.filtre = this.graphEnCours.filtreGraph
    this.gestionTableau()
  }

  ifConnexion(): boolean {
    if (this.route.url === '/Connexion')
      return true;    
    return localStorage.getItem('USER') != null;
  }

  gestionTableau(){
    this.dossierDetail = []
    this.entetes = []
    switch(this.filtre) {
      case"gestionnaire":
        this.gestionnaires.filter(g => g.profil.code != ProfilCode.DIRECTEUR).forEach(g => {
          this.entetes.push({
            nom: g.nom,
            prenom: g.prenom
          })
        })
        this.entetes.push({nom: "Non affectées", prenom: ""})
        this.dossiers.forEach(d => {          
          this.dossierDetail.push({
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
      case"statut":
        this.entetes = this.statuts
        this.dossiers.forEach(d => {          
          this.dossierDetail.push({
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
      case"produit":
        this.entetes = this.produits
        this.dossiers.forEach(d => {      
          this.dossierDetail.push({
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
    }    
  }

}

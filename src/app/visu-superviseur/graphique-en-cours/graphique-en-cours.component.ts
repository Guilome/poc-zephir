import { Component, OnInit } from '@angular/core';
import {Chart} from 'chart.js';
import { Code, Groupe } from '../../shared/domain/groupe';
import { GroupeService } from '../../shared/services/groupe.service';
import { Router } from '@angular/router';
import { TacheService } from '../../shared/services/tache.service';
import { UtilisateurService } from '../../shared/services/utilisateur.service';
import { Utilisateur, Profil } from '../../shared/domain/Utilisateur';
import { ContratService } from '../../shared/services/contrat.service';
import { Contrat } from '../../shared/domain/contrat';
import { Nature, Tache } from '../../shared/domain/Tache';

@Component({
  selector: 'graphique-en-cours',
  templateUrl: './graphique-en-cours.component.html',
  styleUrls: ['./graphique-en-cours.component.css']
})
export class GraphiqueEnCoursComponent implements OnInit {

  mapSubjectEnCours: Map<string, number> = new Map();

  lesGestionnaires: Utilisateur[]
  tachesEnCours = [] 
  lesContrats: Contrat[]
  groupe :Groupe
  context: any;
  public c: Chart;
  private colors = [
    'grey',
    'cyan',
    'red',
    'blue',
    'green',
    'Purple',
    'yellow'
  ];
  // map groupe key/value
  dataGroupe: Map<string, number>;

  constructor(private tacheService: TacheService, 
              private router: Router, 
              private groupeService: GroupeService, 
              private utilService: UtilisateurService,
              private contratService: ContratService) { }

  ngOnInit() {
    this.context = document.getElementById('chartPie');
    this.lesGestionnaires = this.utilService.getAll().filter(g => g.profil != Profil.DIRECTEUR)
    this.monGroupe();
  }

  private monGroupe() {
    this.getDossierEnCours(Code.VERIFICATION)
    this.UpdateCanvas();    
  }

  private  UpdateCanvas() {
    if (this.c == null) {
      this.createCanvas();
    } else {
      this.c.data = {
        labels: Array.from(this.dataGroupe.keys()),
        datasets: [{
          data: Array.from(this.dataGroupe.values()),
          backgroundColor: this.colors
        }]
      };
    }
    this.c.update();
  }

  private createCanvas() {
    if (this.context != null) {
      this.c = new Chart(this.context, {
        type: 'pie',
        data: {
          labels: Array.from(this.mapSubjectEnCours.keys()),
          datasets: [{
            data: Array.from(this.mapSubjectEnCours.values()),
            backgroundColor: this.colors
          }]
        }
        ,
        options: {
          legend: {
            labels: {
              fontColor: 'black',
            },
            position: 'right'
          }
        }
      });
    }
  }

  private getDossierEnCours(codeGroupe: Code) {
    this.tacheService.listerTaches().subscribe(data => this.tachesEnCours = data.filter(t => t.idGroupe = this.groupeService.getIdGroupeByCode(codeGroupe)));
    this.tachesEnCours = this.tachesEnCours.filter(tache => tache.dateCloture == null && tache.nature == Nature.DOSSIER)
    this.refreshMapEnCours(this.tachesEnCours);
  }

  private refreshMapEnCours(lesTaches: Tache[]) {
    // liste des gestionnaires : Initialisation
    this.mapSubjectEnCours.set('Non Affectées', 0);
    this.lesGestionnaires.forEach(g => this.mapSubjectEnCours.set( g.nom+' '+g.prenom, 0))
    for (const t of lesTaches) {
      if (t.idUtilisateur != null) {
        let gestionnaire = this.utilService.getUserById(t.idUtilisateur)
        const key = gestionnaire.nom+' '+gestionnaire.prenom;
        const sum = this.mapSubjectEnCours.get(key);
        this.mapSubjectEnCours.set(key,  sum + 1);
      } else {
        const sum = this.mapSubjectEnCours.get('Non Affectées');
        this.mapSubjectEnCours.set('Non Affectées', sum + 1);
      }
    }
  }
}

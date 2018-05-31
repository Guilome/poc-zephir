import { Component, OnInit } from '@angular/core';
import {Chart} from 'chart.js';
import { Utilisateur, Profil } from '../../shared/domain/Utilisateur';
import { Groupe, Code } from '../../shared/domain/groupe';
import { TacheService } from '../../shared/services/tache.service';
import { Router } from '@angular/router';
import { GroupeService } from '../../shared/services/groupe.service';
import { UtilisateurService } from '../../shared/services/utilisateur.service';
import { ContratService } from '../../shared/services/contrat.service';
import { Tache, Nature } from '../../shared/domain/Tache';

@Component({
  selector: 'graphique-termine',
  templateUrl: './graphique-termine.component.html',
  styleUrls: ['./graphique-termine.component.css']
})
export class GraphiqueTermineComponent implements OnInit {


  mapSubjectTermine: Map<string, number> = new Map();

  lesGestionnaires: Utilisateur[]
  tachesTermine = []
  groupe :Groupe
  context: any;
  public c: Chart;
  private colors = [
    'DodgerBlue',
    'Tan',
    'lightblue',
    'lightgreen',
    'Orchid',
    'PaleGoldenRod'
  ];
  // map groupe key/value
  dataGroupe: Map<string, number>;

  constructor(public tacheService: TacheService, private router: Router, private groupeService: GroupeService, private utilService: UtilisateurService) {

  }

  ngOnInit() {
    this.context = document.getElementById('chartBar');
    this.lesGestionnaires = this.utilService.getAll().filter(g => g.profil != Profil.DIRECTEUR)
    this.monGroupe();

  }

  private monGroupe() {
    this.getDossierTerminé(Code.VERIFICATION)
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
        type: 'bar',
        data: {
          labels: Array.from(this.mapSubjectTermine.keys()),
          datasets: [{
            data: Array.from(this.mapSubjectTermine.values()),
            backgroundColor: this.colors
          }]
        }
        ,
        options: {
          legend: {
            display: false
          }
        }
      });
    }
    Chart.scaleService.updateScaleDefaults('linear', {
      ticks: {
          min: 0
      }
    });
  }

  private getDossierTerminé(codeGroupe: Code){
    this.tacheService.listerTaches().subscribe(data => this.tachesTermine = data.filter(t => t.idGroupe = this.groupeService.getIdGroupeByCode(codeGroupe)));
    this.tachesTermine = this.tachesTermine.filter(tache => tache.dateCloture != null && tache.nature == Nature.DOSSIER)   
    this.refreshMapTermine(this.tachesTermine)
  }

  private refreshMapTermine(lesTaches: Tache[]) {
    // liste des gestionnaires : Initialisation
    let gestionnaires = this.utilService.getAll().filter(g => g.profil != Profil.DIRECTEUR).forEach(g => this.mapSubjectTermine.set( g.nom+' '+g.prenom, 0))
    for (const t of lesTaches) {
      let gestionnaire = this.utilService.getUserById(t.idUtilisateur)
      const key = gestionnaire.nom+' '+gestionnaire.prenom;
      const sum = this.mapSubjectTermine.get(key);
      this.mapSubjectTermine.set(key,  sum + 1);
    }
  }
}

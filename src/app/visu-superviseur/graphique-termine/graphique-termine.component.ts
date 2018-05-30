import { Component, OnInit } from '@angular/core';
import {Chart} from 'chart.js';
import { Utilisateur, Profil } from '../../shared/domain/Utilisateur';
import { Groupe, Code } from '../../shared/domain/groupe';
import { TacheService } from '../../shared/services/tache.service';
import { Router } from '@angular/router';
import { GroupeService } from '../../shared/services/groupe.service';
import { UtilisateurService } from '../../shared/services/utilisateur.service';
import { ContratService } from '../../shared/services/contrat.service';

@Component({
  selector: 'graphique-termine',
  templateUrl: './graphique-termine.component.html',
  styleUrls: ['./graphique-termine.component.css']
})
export class GraphiqueTermineComponent implements OnInit {

  lesGestionnaires: Utilisateur[]
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

  constructor(public tacheService: TacheService, private router: Router, private groupeService: GroupeService, private utilService: UtilisateurService) {

  }

  ngOnInit() {
    this.context = document.getElementById('chartBar');
    this.monGroupe();
    this.lesGestionnaires = this.utilService.getAll().filter(g => g.profil != Profil.DIRECTEUR)

  }

  monGroupe() {
    this.groupeService.getTacheTerminé(Code.VERIFICATION).subscribe(data => {
      this.dataGroupe = data;
      this.UpdateCanvas();
    });
    console.log(this.dataGroupe)    
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
          labels: Array.from(this.dataGroupe.keys()),
          datasets: [{
            data: Array.from(this.dataGroupe.values()),
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

}

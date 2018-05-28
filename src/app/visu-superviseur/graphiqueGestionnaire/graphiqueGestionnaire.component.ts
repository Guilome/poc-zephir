import { Component, OnInit } from '@angular/core';
import {Chart} from 'chart.js';
import { Code, Groupe } from '../../shared/domain/groupe';
import { GroupeService } from '../../shared/services/groupe.service';
import { Router } from '@angular/router';
import { TacheService } from '../../shared/services/tache.service';
import { UtilisateurService } from '../../shared/services/utilisateur.service';
import { Utilisateur } from '../../shared/domain/Utilisateur';

@Component({
  selector: 'graphiqueGestionnaire',
  templateUrl: './graphiqueGestionnaire.component.html',
  styleUrls: ['./graphiqueGestionnaire.component.css']
})
export class GraphiqueGestionnaireComponent implements OnInit {

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

  constructor(public tacheService: TacheService, private router: Router, private groupeService: GroupeService, private utilService: UtilisateurService) { }

  ngOnInit() {
    this.context = document.getElementById('chart');
    this.monGroupe();
    this.lesGestionnaires = this.utilService.getAll()
  }

  monGroupe() {
    this.groupeService.getAffectationTaches(Code.VERIFICATION).subscribe(data => {
      this.dataGroupe = data;
      this.UpdateCanvas();
    });
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
          labels: Array.from(this.dataGroupe.keys()),
          datasets: [{
            data: Array.from(this.dataGroupe.values()),
            backgroundColor: this.colors
          }]
        }
        ,
        options: {
          title: {
            display: true,
            text: 'Groupe Vérification',
            fontColor: 'black'
          },
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

}

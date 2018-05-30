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

@Component({
  selector: 'graphique-en-cours',
  templateUrl: './graphique-en-cours.component.html',
  styleUrls: ['./graphique-en-cours.component.css']
})
export class GraphiqueEnCoursComponent implements OnInit {

  lesGestionnaires: Utilisateur[]
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
    this.monGroupe();
    this.lesGestionnaires = this.utilService.getAll().filter(g => g.profil != Profil.DIRECTEUR)
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

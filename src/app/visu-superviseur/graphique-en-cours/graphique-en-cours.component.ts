import { Component, OnInit } from '@angular/core';
import {Chart} from 'chart.js';
import { Code, Groupe } from '../../shared/domain/groupe';
import { GroupeService } from '../../shared/services/groupe.service';
import { Router, ActivatedRoute } from '@angular/router';
import { TacheService } from '../../shared/services/tache.service';
import { UtilisateurService } from '../../shared/services/utilisateur.service';
import { Utilisateur, Profil } from '../../shared/domain/Utilisateur';
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
  dossiersEnCours = [] 
  groupe :Groupe
  idGroupe: number
  context: any;
  public c: Chart;
  private colors = [
    '#808080',
    '#1E90FF',
    '#D2B48C',
    '#ADD8E6',
    '#90EE90',
    '#DA70D6',
    '#EEE8AA'
  ];
  // map groupe key/value
  dataGroupe: Map<string, number>;

  constructor(private tacheService: TacheService, 
              private router: Router, 
              private groupeService: GroupeService, 
              private utilService: UtilisateurService,
              private activeRoute: ActivatedRoute) { }

  ngOnInit() {
    this.idGroupe = parseInt(this.activeRoute.snapshot.paramMap.get("id"))
    this.groupe = this.groupeService.getGroupeById(this.idGroupe)
    this.context = document.getElementById('chartPie');
    this.lesGestionnaires = this.utilService.getAll().filter(g => g.profil != Profil.DIRECTEUR)
    this.monGroupe();
  }

  private monGroupe() {
    this.groupeService.getDossierEnCours(this.groupe.code).subscribe(data => this.mapSubjectEnCours = data);
    this.UpdateCanvas();    
  }

  private  UpdateCanvas() {
    if (this.c == null) {
      this.createCanvas();
    } else {
      this.c.data = {
        labels: Array.from(this.mapSubjectEnCours.keys()),
        datasets: [{
          data: Array.from(this.mapSubjectEnCours.values()),
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
  private corbeille() {    
    this.groupeService.corbeille(this.groupe.code)
    this.UpdateCanvas()    
  }

  private dispatcher() {
    this.groupeService.dispatcher(this.groupe.code);
    this.UpdateCanvas()
  }

}


 
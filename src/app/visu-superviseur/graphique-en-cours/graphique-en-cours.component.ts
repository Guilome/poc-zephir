import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import {Chart} from 'chart.js';
import { Groupe } from '../../shared/domain/groupe';
import { GroupeService } from '../../shared/services/groupe.service';
import { ActivatedRoute } from '@angular/router';
import { Utilisateur } from '../../shared/domain/Utilisateur';
@Component({
  selector: 'graphique-en-cours',
  templateUrl: './graphique-en-cours.component.html',
  styleUrls: ['./graphique-en-cours.component.css']
})
export class GraphiqueEnCoursComponent implements OnInit {
  
  @Output() details:EventEmitter<boolean> = new EventEmitter<boolean>();

  mapSubjectEnCours: Map<string, number> = new Map();

  public titreCard:string
  filtreGraph: string
  gestionnaire: boolean = true

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

  constructor(private groupeService: GroupeService, 
              private activeRoute: ActivatedRoute) { }

  ngOnInit() {
    this.titreCard = "par gestionnaire"
    this.idGroupe = parseInt(this.activeRoute.snapshot.paramMap.get("id"))
    this.groupe = this.groupeService.getGroupeById(this.idGroupe)
    this.context = document.getElementById('chartPie');
    this.graphGestionnaire();
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
  corbeille() {    
    this.groupeService.corbeille(this.idGroupe)
    this.UpdateCanvas()    
  }

  dispatcher() {
    this.groupeService.dispatcher(this.idGroupe);
    this.UpdateCanvas()
  }

  graphGestionnaire(){
    this.filtreGraph = "gestionnaire"
    this.gestionnaire = true
    this.titreCard = "par gestionnaire"
    this.groupeService.getTacheEnCoursByGroupe(this.idGroupe, "gestionnaire").subscribe(data => this.mapSubjectEnCours = data);    
    this.UpdateCanvas();        
  }

  graphStatut(){
    this.filtreGraph = "statut"
    this.gestionnaire = false
    this.titreCard = "par statut"
    this.groupeService.getTacheEnCoursByGroupe(this.idGroupe, "statut").subscribe(data => this.mapSubjectEnCours = data);    
    this.UpdateCanvas(); 
  }

  graphProduit(){
    this.filtreGraph = "produit"
    this.gestionnaire = false
    this.titreCard = "par produit"
    this.groupeService.getTacheEnCoursByGroupe(this.idGroupe, "produit").subscribe(data => this.mapSubjectEnCours = data);    
    this.UpdateCanvas();    
  }

  AfficherDetail(){
    this.details.emit(true) 
  }
}


 
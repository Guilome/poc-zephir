import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import {Chart} from 'chart.js';
import { Groupe } from '../../shared/domain/Groupe';
import { TacheService } from '../../shared/services/tache.service';
import { ActivatedRoute } from '@angular/router';
import { GroupeService } from '../../shared/services/groupe.service';
import { UtilisateurService } from '../../shared/services/utilisateur.service';
import { Tache } from '../../shared/domain/Tache';
import { ProfilCode } from '../../shared/domain/Profil';

@Component({
  selector: 'graphique-termine',
  templateUrl: './graphique-termine.component.html',
  styleUrls: ['./graphique-termine.component.css']
})
export class GraphiqueTermineComponent implements OnInit {

  @Output() details:EventEmitter<boolean> = new EventEmitter<boolean>();

  mapSubjectTermine: Map<string, number> = new Map();

  dateJour:Date = new Date()
  lesGestionnaires = []
  dossiersTermine = []
  groupe :Groupe
  idGroupe: number
  context: any;

  //Tableau gestion tri date
  daysTab: any[] = [
    {key:0, value:"Sunday"},
    {key:1, value:"Monday"},
    {key:2, value:"Tuesday"},
    {key:3, value:"Wednesday"},
    {key:4, value:"Thursday"},
    {key:5, value:"Friday"},
    {key:6, value:"Saturday"}
  ]

  monthsTab: any[] = [
    {key:0, value:"January", maxDay:31},
    {key:1, value:"February", maxDay:29},
    {key:2, value:"March", maxDay:31},
    {key:3, value:"April", maxDay:30},
    {key:4, value:"May", maxDay:31},
    {key:5, value:"June", maxDay:30},
    {key:6, value:"July", maxDay:31},
    {key:7, value:"August", maxDay:31},
    {key:8, value:"September", maxDay:30},
    {key:9, value:"October", maxDay:31},
    {key:10, value:"November", maxDay:30},
    {key:11, value:"December", maxDay:31}
  ]

  public c: Chart;
  private colors = [
    '#1E90FF',
    '#D2B48C',
    '#ADD8E6',
    '#90EE90',
    '#DA70D6',
    '#EEE8AA'
  ];
  // map groupe key/value
  dataGroupe: Map<string, number>;

  constructor(public tacheService: TacheService, 
              private groupeService: GroupeService, 
              private utilService: UtilisateurService,
              private activeRoute: ActivatedRoute) {

  }

  ngOnInit() {
    this.idGroupe = parseInt(this.activeRoute.snapshot.paramMap.get("id"))
    this.groupe = this.groupeService.getGroupeById(this.idGroupe)
    this.context = document.getElementById('chartBar');
    this.lesGestionnaires = this.utilService.getAll().filter(g => g.profil.code != ProfilCode.DIRECTEUR)
    this.filtrer("mois");
  }

  /**
   * met a les jours les données du graphique
   */
  private  UpdateCanvas() {
    if (this.c == null) {
      this.createCanvas();
    } else {
      this.c.data = {
        labels: Array.from(this.mapSubjectTermine.keys()),
        datasets: [{
          data: Array.from(this.mapSubjectTermine.values()),
          backgroundColor: this.colors
        }]
        
      };
    }
    Chart.scaleService.updateScaleDefaults('linear', {
      ticks: {
          min: 0
      }
    })
    this.c.update();
  }

  /**
   * instancie le graphique
   */
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
          },
          layout: {
            padding: {
              height : 100,
                left: 10,
                right: 0,
                top: 0,
                bottom: 10
            }
          }
        }
      });
    }
  }

  /**
   * filte la liste des dossiers en fonction du jour,semaine ou mois
   * @param typeTri 
   * @param value 
   */
  private dossierTermine(typeTri: string, value: any){
    if (typeTri === "day") {
      this.dossiersTermine = this.tacheService.getTacheTermine().filter(tache => tache.dateCloture.toLocaleDateString() === value)  
    }
    else if (typeTri === "month") {
      this.dossiersTermine = this.tacheService.getTacheTermine().filter(tache => tache.dateCloture.getMonth() == value)  
    }
    else if (typeTri == "week") {     
      this.dossiersTermine = this.tacheService.getTacheTermine().filter(tache => value[0] < tache.dateCloture.getDate() && tache.dateCloture.getDate() < value[1])      
    }      
    this.refreshMapTermine(this.dossiersTermine)
  }

  /**
   * map de donnée du graph
   * @param lesDossiers 
   */
  private refreshMapTermine(lesDossiers: Tache[]) {
    this.lesGestionnaires.filter(g => g.profil.code != ProfilCode.DIRECTEUR && g.profil.groupes.find(g => g == this.idGroupe))
        .forEach(g => this.mapSubjectTermine.set( g.nom.slice(0,1)+'. '+g.prenom, 0))
    for (const d of lesDossiers) {    
      let gestionnaire = this.lesGestionnaires.filter( g => g.ident == d.utilisateurCloture.ident)[0];
      if (gestionnaire.profil.groupes.find(g => g == this.idGroupe)) {
        const key =gestionnaire.nom.slice(0,1)+'. '+gestionnaire.prenom;
        const sum = this.mapSubjectTermine.get(key);
        this.mapSubjectTermine.set(key,  sum + 1);
      }
    }
  }

  /**
   * gère le groupe de bouton jour/semaine/mois
   * @param filter 
   */
  filtrer(filter: string){
    switch(filter){
      case "jour" :
        this.dossierTermine("day", this.dateJour.toLocaleDateString())
        this.UpdateCanvas()
        break;
      case "semaine" :
        let day = this.dateJour.getDay()
        let date = this.dateJour.getDate()
        let debutSemaine
        let semaine
        if (day == 1) { // Si le jour est lundi
          this.dossierTermine("day", this.dateJour.toLocaleDateString())
          this.UpdateCanvas()
        }
        else { // jour autre que lundi
          let difference = date - day 
          if (difference < 0) {
            let month = this.monthsTab[this.dateJour.getMonth()-1]
            debutSemaine = month.maxDay + difference 
            semaine = [debutSemaine.getDate(), date]
          } else {
            difference += 1
            debutSemaine = new Date(this.dateJour.getFullYear(), this.dateJour.getMonth(), difference)
            semaine = [debutSemaine.getDate(), date]
          }
          this.dossierTermine("week", semaine)
          this.UpdateCanvas()  
        }     
        break;
      case "mois" :   
        this.dossierTermine("month", this.dateJour.getMonth())
        this.UpdateCanvas() 
        break;
    }
  }
  
  AfficherDetail(){
    this.details.emit(true) 
  }
}

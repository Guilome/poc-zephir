import { Component, OnInit } from '@angular/core';
import {Chart} from 'chart.js';
import { Utilisateur, Profil } from '../../shared/domain/Utilisateur';
import { Groupe, Code } from '../../shared/domain/groupe';
import { TacheService } from '../../shared/services/tache.service';
import { Router, ActivatedRoute } from '@angular/router';
import { GroupeService } from '../../shared/services/groupe.service';
import { UtilisateurService } from '../../shared/services/utilisateur.service';
import { Tache, Nature } from '../../shared/domain/Tache';
import { tick } from '@angular/core/testing';

@Component({
  selector: 'graphique-termine',
  templateUrl: './graphique-termine.component.html',
  styleUrls: ['./graphique-termine.component.css']
})
export class GraphiqueTermineComponent implements OnInit {

  mapSubjectTermine: Map<string, number> = new Map();


  dateJour:Date = new Date("05-10-2018")
  lesGestionnaires: Utilisateur[]
  dossiersTermine:Tache[] = []
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
              private router: Router, 
              private groupeService: GroupeService, 
              private utilService: UtilisateurService,
              private activeRoute: ActivatedRoute) {

  }

  ngOnInit() {
    this.idGroupe = parseInt(this.activeRoute.snapshot.paramMap.get("id"))
    this.groupe = this.groupeService.getGroupeById(this.idGroupe)
    this.context = document.getElementById('chartBar');
    this.lesGestionnaires = this.utilService.getAll().filter(g => g.profil != Profil.DIRECTEUR)
    this.monGroupe();
  }

  private monGroupe() {
    this.trierMois()
    this.UpdateCanvas();
  }

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

  private getDossierTermine(codeGroupe: Code, typeTri: string, value: any){
    if (typeTri === "day" || typeTri == "month") {
      this.dossiersTermine = this.tacheService.getDossierTermine().filter(tache => tache.dateCloture.toLocaleDateString().includes(value))  
    } else if (typeTri == "week") {     
      this.dossiersTermine = this.tacheService.getDossierTermine().filter(tache => value[0] < tache.dateCloture.getDate() && tache.dateCloture.getDate() < value[1])      
    }
    this.refreshMapTermine(this.dossiersTermine)
  }

  private refreshMapTermine(lesDossiers: Tache[]) {
    this.lesGestionnaires.filter(g => g.profil != Profil.DIRECTEUR).forEach(g => this.mapSubjectTermine.set( g.nom.slice(0,1)+'. '+g.prenom, 0))
    for (const d of lesDossiers) {
      let gestionnaire = this.utilService.getUserById(d.idUtilisateur)
      const key =gestionnaire.nom.slice(0,1)+'. '+gestionnaire.prenom;
      const sum = this.mapSubjectTermine.get(key);
      this.mapSubjectTermine.set(key,  sum + 1);
    }
  }
  
  trierJour(){
    this.getDossierTermine(this.groupe.code, "day", this.dateJour.toLocaleDateString())
    this.UpdateCanvas()
  }
  trierSemaine(){
    let day = this.dateJour.getDay()
    console.log("day : " + day)    
    let date = this.dateJour.getDate()
    console.log("date : " + date)
    let debutSemaine
    let semaine
    if (day == 1) { // Si le jour est lundi
      this.getDossierTermine(this.groupe.code, "day", this.daysTab[day])
      this.UpdateCanvas()
    }
    else { // jour autre que lundi
      let difference = date - day 
      console.log("difference (date - day) : "  + difference)      
      if (difference < 0) {
        let month = this.monthsTab[this.dateJour.getMonth()-1]
        debutSemaine = month.maxDay + difference 
        semaine = [debutSemaine.getDate(), date]
      } else {
        difference += 1
        debutSemaine = new Date(this.dateJour.getFullYear(), this.dateJour.getMonth(), difference)
        semaine = [debutSemaine.getDate(), date]
      }
    }     
    this.getDossierTermine(this.groupe.code, "week", semaine)
    this.UpdateCanvas()  
  }
  trierMois(){
    let month ='0'+ (this.dateJour.getMonth() + 1)    
    this.getDossierTermine(this.groupe.code, "month", month)
    this.UpdateCanvas() 
  }
  
}

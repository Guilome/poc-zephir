import { Component, OnInit } from '@angular/core';
import {Chart} from 'chart.js';
import { Utilisateur, Profil } from '../../shared/domain/Utilisateur';
import { Groupe, Code } from '../../shared/domain/groupe';
import { TacheService } from '../../shared/services/tache.service';
import { Router, ActivatedRoute } from '@angular/router';
import { GroupeService } from '../../shared/services/groupe.service';
import { UtilisateurService } from '../../shared/services/utilisateur.service';
import { Tache, Nature } from '../../shared/domain/Tache';

@Component({
  selector: 'graphique-termine',
  templateUrl: './graphique-termine.component.html',
  styleUrls: ['./graphique-termine.component.css']
})
export class GraphiqueTermineComponent implements OnInit {

  mapSubjectTermine: Map<string, number> = new Map();

  dateJour:Date = new Date()
  lesGestionnaires: Utilisateur[]
  dossiersTermine:Tache[] = []
  groupe :Groupe
  idGroupe: number
  context: any;
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
    this.getDossierTermine(this.groupe.code, this.dateJour.getMonth().toString(), null)
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
                left: 10,
                right: 0,
                top: 0,
                bottom: 10
            }
          }
        }
      });
    }
    Chart.scaleService.updateScaleDefaults('linear', {
      ticks: {
          min: 0,
          max: 25,
          stepSize: 1
      }
    })
  }

  private getDossierTermine(codeGroupe: Code, date:string, semaine: number[]){
    if (date == null && semaine == null) {
      console.log("j'entre la");      
      this.tacheService.listerTaches().subscribe(data => this.dossiersTermine = data.filter(t => t.idGroupe = this.groupeService.getIdGroupeByCode(codeGroupe)));
      this.dossiersTermine = this.dossiersTermine.filter(tache => tache.dateCloture != null && tache.nature == Nature.DOSSIER)   
    } else if (date != null && semaine == null) {
      console.log("ou la");      
      this.tacheService.listerTaches().subscribe(data => this.dossiersTermine = data.filter(t => t.idGroupe = this.groupeService.getIdGroupeByCode(codeGroupe)));
      this.dossiersTermine = this.dossiersTermine.
      filter(tache => tache.nature == Nature.DOSSIER && tache.dateCloture != null && tache.dateCloture.toLocaleDateString().includes(date))   
    } else if (semaine != null && date == null) {
      console.log("ou encore ici");      
      this.tacheService.listerTaches().subscribe(data => this.dossiersTermine = data.filter(t => t.idGroupe = this.groupeService.getIdGroupeByCode(codeGroupe)));
      this.dossiersTermine = this.dossiersTermine.
      filter(tache => tache.nature == Nature.DOSSIER && tache.dateCloture != null && semaine[0] < tache.dateCloture.getDate() && tache.dateCloture.getDate() < semaine[1])
      console.log(this.dossiersTermine);         
    }
    this.refreshMapTermine(this.dossiersTermine)
  }

  private refreshMapTermine(lesDossiers: Tache[]) {
    // liste des gestionnaires : Initialisation
    this.lesGestionnaires.filter(g => g.profil != Profil.DIRECTEUR).forEach(g => this.mapSubjectTermine.set( g.nom.slice(0,1)+'. '+g.prenom, 0))
    for (const d of lesDossiers) {
      let gestionnaire = this.utilService.getUserById(d.idUtilisateur)
      const key =gestionnaire.nom.slice(0,1)+'. '+gestionnaire.prenom;
      const sum = this.mapSubjectTermine.get(key);
      this.mapSubjectTermine.set(key,  sum + 1);
    }
  }
  
  private trierJour(){
    this.getDossierTermine(this.groupe.code, this.dateJour.toLocaleDateString(), null)
    this.UpdateCanvas()
  }
  private trierSemaine(){
    let day = this.dateJour.getDate()
    let day7 = day - 7
    let semaine = [day7, day]
    console.log(day);
    console.log(day7);  
    this.getDossierTermine(this.groupe.code, null, semaine)
    this.UpdateCanvas()   
  }
  private trierMois(){
    let month ='0'+ (this.dateJour.getMonth() + 1)
    this.getDossierTermine(this.groupe.code, month, null)
    this.UpdateCanvas() 
  }
}

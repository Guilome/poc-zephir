import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { GroupeService } from '../shared/services/groupe.service';
import { TitreService } from '../shared/services/titre.service';

@Component({
  selector: 'app-visu-superviseur',
  templateUrl: './visu-superviseur.component.html',
  styleUrls: ['./visu-superviseur.component.css']
})
export class VisuSuperviseurComponent implements OnInit {

  idGroupe: number

  constructor(private route: Router, 
              private activeRoute: ActivatedRoute, 
              private titreService: TitreService, 
              private groupeService: GroupeService) { 
  }

  ngOnInit() {
    this.idGroupe = parseInt(this.activeRoute.snapshot.paramMap.get("id"))
    localStorage.setItem("GROUPE", this.idGroupe.toString());
    this.titreService.updateTitre("Gestion du groupe " + this.groupeService.getGroupeById(this.idGroupe).libelle.toLowerCase())
  }

  ifConnexion(): boolean {
    if (this.route.url === '/Connexion')
      return true;    
    return localStorage.getItem('USER') != null;
  }

}

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GroupeService } from '../shared/services/groupe.service';
import { Code } from '../shared/domain/groupe';

@Component({
  selector: 'app-visu-superviseur',
  templateUrl: './visu-superviseur.component.html',
  styleUrls: ['./visu-superviseur.component.css']
})
export class VisuSuperviseurComponent implements OnInit {

  constructor(private route: Router, private groupeService: GroupeService) { }

  ngOnInit() {
  }

  ifConnexion(): boolean {
    if (this.route.url === '/Connexion')
      return true;
    return localStorage.getItem('USER') != null;
  }

  corbeille() {
    this.groupeService.corbeille(Code.VERIFICATION);
  }
}

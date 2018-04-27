import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-visu-gestion',
  templateUrl: './visu-gestion.component.html',
  styleUrls: ['./visu-gestion.component.css']
})
export class VisuGestionComponent implements OnInit {

  mesTaches = 'Mes tâches';
  mesDevisAvalider = 'Mes devis à valider';
  card = 'bg-info';
  constructor() { }

  ngOnInit() {
  }

}

import { Component, OnInit } from '@angular/core';
import {Chart} from 'chart.js';
import {TitreService} from '../shared/services/titre.service';
@Component({
  selector: 'app-visu-gestion',
  templateUrl: './visu-gestion.component.html',
  styleUrls: ['./visu-gestion.component.css']
})
export class VisuGestionComponent implements OnInit {


  constructor(private titreService: TitreService) { }

  ngOnInit() {
    this.titreService.updateTitre('Tableau de Bord');
  }

}

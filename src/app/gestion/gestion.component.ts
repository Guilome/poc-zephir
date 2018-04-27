import {Component, Input, OnInit} from '@angular/core';
import {debug, log} from 'util';

@Component({
  selector: 'app-gestion',
  templateUrl: './gestion.component.html',
  styleUrls: ['./gestion.component.css']
})
export class GestionComponent implements OnInit {

  @Input() titre: string;
  @Input() card: string;

  eye = false;
  search = false;
  share = false;
  inbox = false;
  calendar = false;
  file = false;
  filter = false;
  refresh = false;
  chart = false;
  trash = false;

  constructor() {
  }

  ngOnInit() {

    if (this.titre === 'Mes tâches') {
        this.mesTaches();
    } else if (this.titre === 'Mes devis à valider') {
        this.mesDevis();
    } else if (this.titre === 'Mes Notes') {
      this.mesNotes();
    }

  }

  private mesTaches() {
    this.eye = true;
    this.search = true;
    this.share = true;
    this.inbox = true;
    this.calendar = true;
    this.file = true;
    this.filter = true;
    this.chart = true;
    this.refresh = true;

  }

  private mesDevis() {
    this.eye = true;
    this.search = true;
    this.inbox = true;
    this.file = true;
    this.filter = true;
    this.refresh = true;
  }

  private mesNotes() {
    this.eye = true;
    this.search = true;
    this.inbox = true;
    this.file = true;
    this.filter = true;
    this.refresh = true;
    this.trash = true;
  }



}



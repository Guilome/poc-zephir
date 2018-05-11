import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-conformite',
  templateUrl: './conformite.component.html',
  styleUrls: ['./conformite.component.css']
})
export class ConformiteComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }

  terminer() {
    this.router.navigate(['/gestionBO']);

  }

  DocSuivant() {

  }
}

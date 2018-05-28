import { Component, OnInit } from '@angular/core';
import { ActionMetierService } from '../../../../shared/services/action-metier.service';
import { Tache } from '../../../../shared/domain/Tache';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-information-conducteur',
  templateUrl: './information-conducteur.component.html',
  styleUrls: ['./information-conducteur.component.css']
})
export class InformationConducteurComponent implements OnInit {

  public currentCRM = 0.68;
  public currentDate2delivrance = '2000-01-01';
  currentTache: Tache;
  constructor(private actionMetierService: ActionMetierService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.currentCRM = 0.68;
    this.currentDate2delivrance = '2000-01-01';
    const id = this.route.params['id'];
    this.currentTache = this.actionMetierService.getById(+id)
  }
  ngAfterViewInit() {
    this.currentCRM = 0.68;
    this.currentDate2delivrance = '2000-01-01';
  }

  ifChangement(crm, date2delivrance):boolean {
    if(crm.value != this.currentCRM || date2delivrance.value != this.currentDate2delivrance) {
      return true;
    }
    return false;
  }

  /**
   *
   * @param date 
   * Entrer : format YYYY-MM-dd
   * sortie : format dd/MM/YYYY
   */
  dateFormat(date:string): string {
    return date.split('-')[2] + '/' +  date.split('-')[1] + '/' + date.split('-')[0];
  }

  /**
   * Création automatique d'une action mtier
   */
  demandeSansEffet(){
    this.actionMetierService.create(this.currentTache);
  }
}

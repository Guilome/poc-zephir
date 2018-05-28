import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-information-conducteur',
  templateUrl: './information-conducteur.component.html',
  styleUrls: ['./information-conducteur.component.css']
})
export class InformationConducteurComponent implements OnInit {

  public currentCRM = 0.68;
  public currentDate2delivrance = '2000-01-01';
  constructor() { }

  ngOnInit() {
    this.currentCRM = 0.68;
    this.currentDate2delivrance = '2000-01-01';
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
}

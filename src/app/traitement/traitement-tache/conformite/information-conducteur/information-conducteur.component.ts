import { Component, OnInit } from '@angular/core';
import { ActionMetierService } from '../../../../shared/services/action-metier.service';
import { Tache } from '../../../../shared/domain/Tache';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { TacheService } from '../../../../shared/services/tache.service';

@Component({
  selector: 'app-information-conducteur',
  templateUrl: './information-conducteur.component.html',
  styleUrls: ['./information-conducteur.component.css']
})
export class InformationConducteurComponent implements OnInit {

  public currentCRM = 0.68;
  public currentDate2delivrance = '2000-01-01';
  currentTache: Tache;
  constructor(private actionMetierService: ActionMetierService,
              private tacheService: TacheService,
              private route: ActivatedRoute,
              private router: Router,
              private toastr: ToastrService) { }

  ngOnInit() {
    this.currentCRM = 0.68;
    this.currentDate2delivrance = '2000-01-01';
    this.route.params.subscribe(data => {
      this.currentTache = this.tacheService.getTacheById(+data['id']);
     
    });

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
    this.toastr.success('Une demande "SANS-EFFET" a été creé');
    this.docSuivant();
  }

  private docSuivant() {

    const idNext = this.tacheService.nextId(this.currentTache.ident, parseInt(localStorage.getItem('USER'), 10));
    if (idNext == null || this.currentTache.ident === idNext ) {
      this.router.navigate(['/gestionBO']);

    } else {

      this.router.navigate(['/TraitementTache', idNext]);

    }
  }
}

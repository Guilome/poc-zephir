import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Tache, Status} from '../../../shared/domain/Tache';
import {TacheService} from '../../../shared/services/tache.service';
import {Subscription} from 'rxjs/Subscription';

@Component({
  selector: 'app-conformite',
  templateUrl: './conformite.component.html',
  styleUrls: ['./conformite.component.css']
})
export class ConformiteComponent implements OnInit {

  constructor(private router: Router, private tacheService: TacheService, private route: ActivatedRoute) {
  }
  tache: Tache;
  private idSubscription: Subscription;

  ngOnInit() {
 /*   //const id = this.route.snapshot.params['id'];

    this.tache = this.tacheService.getTacheById(+id);
*/
    this.idSubscription = this.route.params.subscribe((params: any) => {
      this.tache = this.tacheService.getTacheById(+params.id);
    });


  }

  /*
   Fermer la tache et créer une nouvelle si étape "A_VALIDER"
    */
  conforme(alertSuccess) {
    if (this.tache.dateCloture == null) {
      if (this.tache.status === Status.A_VERIFIER) {
      if (confirm('Etes-vous sûr de vouloir passer à l\'étape de validation ?')) {
        this.tacheService.updateStatus(this.tache.ident);
        this.alertShow(alertSuccess, 'Le status de la tache a été modifier en <strong>À VALIDER</strong>');
      }

    } else if (this.tache.status === Status.A_VALIDER) {
      if (confirm('Confirmez-vous la conformité de ce document ?')) {
        this.tacheService.setDateCloture(this.tache.ident);
        this.alertShow(alertSuccess, 'La tâche a été fermée');
      }
    }
  } else {
      this.alertShow(alertSuccess, 'La tâche a été fermée le ' + this.formatDateDDmmYYYY(this.tache.dateCloture));
    }
  }
  /*
    FERMER LA TACHE dans les deux étapes (à voir)
    Message de cloture obligtoire
  */
  nonConforme(motif, alertDanger: any) {
    if (this.tache.dateCloture == null) {
      if (motif.value.trim() !== '') {
        this.tacheService.closeTacheNonConforme(this.tache.ident, motif.value);
        const nextId = this.tacheService.nextId(this.tache.ident);
        this.tache = this.tacheService.getTacheById(nextId);
        this.alertShow(alertDanger, 'La tâche a été fermé');
      } else {
        this.alertShow(alertDanger, 'Veuillez renseigner le motif');
      }
    } else {
      this.alertShow(alertDanger, 'Aucune action possible : La tâche a été fermée le ' + this.formatDateDDmmYYYY(this.tache.dateCloture));
    }
  }

  /*
    les documents sont triés en fonction de leurs "ident" dès qu'on arrive au dernier ident la page bascule au DashBoard
   */
  DocSuivant() {
    const idNext = this.tacheService.nextId(this.tache.ident);
    if (idNext == null || this.tache.ident === idNext ) {
      this.goToDashboard();
    } else {
      this.goToProductDetails(idNext);
    }
  }

  goToProductDetails(id) {
    this.router.navigate(['/TraitementTache', id]);
  }
  private goToDashboard() {
    this.router.navigate(['/gestionBO']);
  }

  private alertShow(alert, msg) {
    alert.style.visibility = 'visible';
    alert.innerHTML = msg;
    setTimeout(function() {alert.style.visibility = 'hidden'; }, 8000);
  }

  private formatDateDDmmYYYY(date: Date): string {
    return ('0' + (date.getDate() + 1)).slice(-2)  + '/' + ('0' + (date.getMonth() + 1)).slice(-2) + '/' + date.getFullYear();
  }
}

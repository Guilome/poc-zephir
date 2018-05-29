import {AfterContentInit, Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Tache, Status} from '../../../shared/domain/Tache';
import {TacheService} from '../../../shared/services/tache.service';
import {Subscription} from 'rxjs/Subscription';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-conformite',
  templateUrl: './conformite.component.html',
  styleUrls: ['./conformite.component.css']
})
export class ConformiteComponent implements OnInit {

  constructor(private router: Router, 
    private tacheService: TacheService, 
    private route: ActivatedRoute, 
    public toastr: ToastrService) {}

  tache: Tache;
  private idSubscription: Subscription;
  public motifBoolean = false;

  // multiplSelect
  dropdownList = [];
  selectedItems = [];
  dropdownSettings = {};
  ngOnInit(){
      this.idSubscription = this.route.params.subscribe((params: any) => {
        this.tache = this.tacheService.getTacheById(+params.id);
      });
      this.dropdownList = [
                            {"id": 1, "itemName":"CRM non conforme"},
                            {"id": 2, "itemName":"Véhicule interdit à la souscription"}
                          ];
      this.selectedItems = [];
      this.dropdownSettings = { 
                                singleSelection: false, 
                                text:"Selectionner un ou plusieurs motifs",
                                selectAllText:'Tout Selectionner',
                                unSelectAllText:'Tout désélectionner',
                                enableSearchFilter: true,
                                classes:"myclass custom-class"
                              };
                            }
  

  /*
   Fermer la tache et créer une nouvelle si étape "A_VALIDER"
    */
  conforme() {
    this.motifBoolean = false;
    this.selectedItems = [];
    if (this.tache.dateCloture == null) {
      if (this.tache.status === Status.A_VERIFIER) {
      if (confirm('Etes-vous sûr de vouloir passer à l\'étape de validation ?')) {
        //this.docSuivant();
        this.tacheService.updateStatusAndGroupe(this.tache.ident);
        this.toastr.success('Le status de la tache a été modifier en <b>À VALIDER</b>', '', {enableHtml: true});
      }

    } else if (this.tache.status === Status.A_VALIDER) {
      if (confirm('Confirmez-vous la conformité de ce document ?')) {
        this.tache = this.tacheService.setDateClotureAndStatus(this.tache.ident);
        this.toastr.success('La tâche a été <b>fermée</b>', '', {enableHtml: true});
      }
    }
  } else {
      this.toastr.success('La tâche a été fermée le ' + this.formatDateDDmmYYYY(this.tache.dateCloture), '', {enableHtml: true});
    }
  }
  /*
    FERMER LA TACHE dans les deux étapes (à voir)
    Message de cloture obligtoire
  */
  nonConforme() {
    if (this.tache.dateCloture == null) {
      if (this.motifBoolean) {
        
        if (this.selectedItems.length > 0) {
          
          this.tacheService.closeTacheNonConforme(this.tache.ident, this.recuperationMotif());
          //this.docSuivant();
          this.toastr.success('La tâche a été fermé');
          this.selectedItems = [];
          this.motifBoolean = false;
          
        } else {
          this.toastr.error('Veuillez renseigner le(s) motif(s)');
        }
      } else {
        this.motifBoolean = true;
      }
    } else {
      this.toastr.error('Aucune action possible : La tâche a été fermée le ' + this.formatDateDDmmYYYY(this.tache.dateCloture));
    }
    
  }

  /*
    les documents sont triés en fonction de leurs "ident" dès qu'on arrive au dernier ident la page bascule au DashBoard
   */
  /*docSuivant() {
    console.log('ident :' + this.tache.ident);

    const idNext = this.tacheService.nextId(this.tache.ident, parseInt(localStorage.getItem('USER'), 10));
    if (idNext == null || this.tache.ident === idNext ) {
      this.goToDashboard();
    } else {

      this.goToTacheDetails(idNext);
    }
  }*/

  goToTacheDetails(id) {
    this.router.navigate(['/TraitementTache', id]);
  }
  goToDashboard() {
    this.router.navigate(['/gestionBO']);
  }

  private alertShow(alert, msg) {
    alert.style.display = 'block';

    alert.innerHTML = msg;
    setTimeout(function() {alert.style.display = 'none'; }, 4000);
  }

  private formatDateDDmmYYYY(date: Date): string {
    return ('0' + (date.getDate() + 1)).slice(-2)  + '/' + ('0' + (date.getMonth() + 1)).slice(-2) + '/' + date.getFullYear();
  }


  private recuperationMotif(): string {
    let motif = '';
    for(let i in this.selectedItems){
      motif += this.selectedItems[i]['itemName'] + '.\n';
    }
    return motif;
  }
}

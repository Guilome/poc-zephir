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

  piece: Tache;
  private idSubscription: Subscription;
  public motifBoolean = false;

  // multiplSelect
  dropdownList = [];
  selectedItems = [];
  dropdownSettings = {};
  ngOnInit(){
      this.idSubscription = this.route.params.subscribe((params: any) => {
        this.piece = this.tacheService.getPieceById(+params.piece);
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
    if (this.piece.dateCloture == null) {
      if (this.piece.status === Status.A_VERIFIER) {
      if (confirm('Etes-vous sûr de vouloir passer à l\'étape de validation ?')) {
        //this.docSuivant();
        
        this.tacheService.toEtapeValidation(this.piece.ident);
        //this.toastr.success('Le status de la tache a été modifier en <b>À VALIDER</b>', '', {enableHtml: true});
        this.toastr.success('La pièce a été affectée à la bannette  <b>VALIDATION</b>', '', {enableHtml: true});

      }

    } else if (this.piece.status === Status.A_VALIDER) {
      if (confirm('Confirmez-vous la conformité de ce document ?')) {
        this.piece = this.tacheService.closePieceConforme(this.piece.ident);
        this.toastr.success('La tâche a été <b>fermée</b>', '', {enableHtml: true});
      }
    }
  } else {
      this.toastr.success('La tâche a été fermée le ' + this.formatDateDDmmYYYY(this.piece.dateCloture), '', {enableHtml: true});
    }
    this.titleStatus()

  }
  /*
    FERMER LA TACHE dans les deux étapes (à voir)
    Message de cloture obligtoire
  */
  nonConforme() {
    if (this.piece.dateCloture == null) {
      if (this.motifBoolean) {
      } else {
        this.motifBoolean = true;
      }
    } else {
      this.toastr.error('Aucune action possible : La tâche a été fermée le ' + this.formatDateDDmmYYYY(this.piece.dateCloture));
    }
    
  }
  valider() {
    if (this.selectedItems.length > 0) {
          
      this.tacheService.closePieceNonConforme(this.piece.ident, this.recuperationMotif());
      this.toastr.success('La tâche a été fermé');
      this.selectedItems = [];
      this.motifBoolean = false;
      this.titleStatus();
      this.docSuivant();
    } else {
      this.toastr.error('Veuillez renseigner le(s) motif(s)');
    }
  }

  private docSuivant() {

    let idNext = 0;
    let boolTmp: boolean = false
    this.tacheService.getPiecesByContext(this.piece.context).forEach((val, index) => {
      if(boolTmp){
        idNext = val.ident;
        boolTmp = false;
      }    
      if (val.ident == this.piece.ident){
            boolTmp = true; 
          }

    });

    if (idNext == null || this.piece.ident === idNext ) {
      this.router.navigate(['/gestionBO']);
    } else {
      this.router.navigate(['/TraitementTache', { id: this.piece.context.ident, piece: idNext }]);
    }
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

  private titleStatus() {
    // Status 
    let idLabelStatus = document.getElementById('idLabelStatus');
    idLabelStatus.innerHTML = '<span style="color: green">OK</span>'
    for (let p of this.tacheService.getPiecesByIdContext(this.piece.context.ident)) {
      if(p.status === 'À vérifier') {
        idLabelStatus.innerHTML = '<span style="color: #ffc520">Vérfication</span>';
        return;
      }
      if (p.status === 'À valider') {
        idLabelStatus.innerHTML = '<span style="color: #00b3ee" >Validation</span>';
      }
    }
  }

  listMotifs(): string[] {
    let lList = [];
    const taille = this.piece.message.split('.').length - 1;
    for ( let i = 0 ; i < taille ; i++ ) {
      lList.push(this.piece.message.split('.')[i]);
    }
    return lList;
  }

}

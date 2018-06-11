import {AfterContentInit, Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Tache, Status} from '../../../shared/domain/Tache';
import {TacheService} from '../../../shared/services/tache.service';
import {Subscription} from 'rxjs/Subscription';
import {ToastrService} from 'ngx-toastr';
import { GroupeService } from '../../../shared/services/groupe.service';
import { UtilisateurService } from '../../../shared/services/utilisateur.service';

@Component({
  selector: 'app-conformite',
  templateUrl: './conformite.component.html',
  styleUrls: ['./conformite.component.css']
})
export class ConformiteComponent implements OnInit {

  constructor(private router: Router, 
    private tacheService: TacheService, 
    private route: ActivatedRoute, 
    public toastr: ToastrService,
    private groupeService: GroupeService,
    private utilisateurService: UtilisateurService) {}

  piece: Tache;
  private idSubscription: Subscription;
  public motifBoolean = false;

  private idCurrentUser: number
  private dossier: Tache;

  // multiplSelect
  dropdownList = [];
  selectedItems = [];
  dropdownSettings = {};
  ngOnInit(){
      this.idCurrentUser = +localStorage.getItem('USER');
      this.idSubscription = this.route.params.subscribe((params: any) => {
        this.piece = this.tacheService.getPieceById(+params.piece);
      });
      this.dossier = this.tacheService.getDossierByIdContext(this.piece.context.ident, this.idCurrentUser);

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
        
        this.tacheService.toEtapeValidation(this.piece.ident);
        this.toastr.success('La pièce a été <b>vérifiée</b>', '', {enableHtml: true});
        this.docSuivant();
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

  /**
   * Cas de la Bannette vérification 
   */
  private docSuivant() {

    let idNext = null;
    let boolTmp: boolean = false
    for ( let val of this.tacheService.getPiecesByDossier(this.dossier.ident)) {
         if(val.status != 'À valider' ) {
             idNext = val.ident;
            break;
         } 
     }
       
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
    let bVerification: boolean = false;
    idLabelStatus.innerHTML = '<span style="color: green">OK</span>'
    for (let p of this.tacheService.getPiecesByDossier(this.dossier.ident)) {
      if(p.status === 'À vérifier' ||  p.status === 'En attente') {
        idLabelStatus.innerHTML = '<span style="color: #ffc520">Vérification</span>';
        bVerification = true;
        break;
      }
      if (p.status === 'À valider') {
        idLabelStatus.innerHTML = '<span style="color: #00b3ee" >Validation</span>';
      }
    }
    // le status du dossier est toujours en vérification, car une des pièces est au statut "à vérifier"
    if(!bVerification){
      // Si l'utilisateur ne fait pas parti du groupe validation 
      if( !this.groupeValidation()) {
          // Passage du dossier à l'étape de validation
          this.toastr.success('Passage à la banette <b>VALIDATION</b>', '', {enableHtml: true}); 
          this.tacheService.toEtapeValidation(this.piece.idTacheMere);
          this.router.navigate(['/gestionBO']);
      }
    }
  }

  listMotifs(): string[] {
    let lList = [];
    const taille = this.piece.motifNonConformite.split('.').length - 1;
    for ( let i = 0 ; i < taille ; i++ ) {
      lList.push(this.piece.motifNonConformite.split('.')[i]);
    }
    return lList;
  }

  groupeVerification(): boolean {
    if ( this.groupeService.isVerification(this.idCurrentUser)){
        return true;//this.piece.status != 'À valider';
    } 
    return false;
  }

  /**
   * retourne le nom de la personne qui a vérifié la piece
   */
  getNomVerification(): string {
    return this.utilisateurService.getName(this.piece.idUtilisateurVerification);
  }

  /**
   * return le nom de la personne qui a validé la piece
   */
  getNomValidation(): string {
    return this.utilisateurService.getName(this.piece.idUtilisateurCloture);

  }

  groupeValidation(): boolean {
    if ( this.groupeService.isValidation(this.idCurrentUser)){
      return this.piece.status === 'À valider';
  } 
    return false;
  }

  /**
   * Envoie une relance qui correspond au papier en train d'être valider
   * @param type 
   */
  renouvelerDemande(type: string){
    
  }

}

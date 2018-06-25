import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Tache, Status} from '../../../shared/domain/Tache';
import {TacheService} from '../../../shared/services/tache.service';
import {Subscription} from 'rxjs';
import {ToastrService} from 'ngx-toastr';
import { GroupeService } from '../../../shared/services/groupe.service';
import { UtilisateurService } from '../../../shared/services/utilisateur.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

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
    private utilisateurService: UtilisateurService,
    private modalService: NgbModal) {}

  piece: Tache;
  private idSubscription: Subscription;

  private idCurrentUser: number
  private dossier: Tache;

  currentModal: NgbModalRef;
  dropdownSettings = {};
  motifselected = [];
  motifsData: any;
  ngOnInit(){
    this.motifsData = [
      {"id": 'ATT_CI', "itemName":"Non visible"},
      {"id": 'ATT_MDP', "itemName":"CRM non conforme"}
    ];
    this.motifselected = [];

      this.idCurrentUser = +localStorage.getItem('USER');
      this.idSubscription = this.route.params.subscribe((params: any) => {
        this.piece = this.tacheService.getTacheById(+params.piece);
     
      });
      
      this.tacheService.listerTaches().subscribe(data => { 
                                    if (this.piece != null) 
                                      this.dossier = this.tacheService.getDossierById(this.piece.idTacheMere)
                                    });

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
   Validation de la pièce à l"étape de vérification
    */
  conforme() {
    this.motifselected = [];
    if (this.piece.dateCloture == null) {
      if (confirm('Etes-vous sûr de vouloir passer à l\'étape de validation ?')) {
        
        this.tacheService.toEtapeValidation(this.piece.ident);
        this.toastr.success('La pièce a été <b>vérifiée</b>', '', {enableHtml: true});
        this.docSuivant();
    } 
  } else {
      this.toastr.success('La tâche a été fermée le ' + this.formatDateDDmmYYYY(this.piece.dateCloture), '', {enableHtml: true});
    }

  }
  /**
   * Cas de la Bannette vérification 
   */
  private docSuivant() {

    let idNext = null;
  
    for ( let val of this.tacheService.getPiecesByDossier(this.dossier.ident)) {
        
         if(val.status === Status.A_VERIFIER ) {
             idNext = val.ident;
             break;
         } 
     }
       
    if (idNext == null) {
      if (this.utilisateurService.getUserById(this.idCurrentUser) != null) {
       // this.tacheService.affecterTacheUtilisateur(this.dossier, null)
      }      
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
    for(let i in this.motifselected){
      motif += this.motifselected[i]['itemName'] + '.\n';
    }
    return motif;
  }

  listMotifs(): string[] {
    let lList = [];
    const taille = this.piece.motifNonConformite.split('.').length -1;
    for ( let i = 0 ; i < taille ; i++ ) {
      lList.push(this.piece.motifNonConformite.split('.')[i]);
    }
    return lList;
  }

  groupeVerification(): boolean {
    if(this.dossier != null)
        return this.tacheService.getStatutTache(this.dossier) != 'À valider';
    return false;
  }
  groupeValidation(): boolean {
    if(this.dossier != null)
      return this.tacheService.getStatutTache(this.dossier) === 'À valider';
    return false;
   }

  /**
   * retourne le nom de la personne qui a vérifié la piece
   */
  getNomVerification(): string {
    if(this.piece != null)
        return this.utilisateurService.getName(this.piece.utilisateurVerification.ident);
    return '';
  }

  /**
   * return le nom de la personne qui a validé la piece
   */
  getNomValidation(): string {
    if(this.piece != null)
    return this.utilisateurService.getName(this.piece.utilisateurCloture.ident);
    return '';

  }



  /**
   * Envoie une relance qui correspond au papier en train d'être valider
   *  
   */
  renouvelerDemande(content: any){
    this.currentModal = this.modalService.open(content, { size : 'lg', centered : true, backdrop: 'static' });
   // 
  }
  /**
   * Demander une nouvelle pièces avec les motifs de non conformiité.
   */
  demanderNouvellePiece() {
    if ( this.motifselected.length > 0){
    this.piece.message = (<HTMLInputElement>document.getElementById('noteComplementaire')).value  
    if ( this.piece.status != 'À vérifier') {
          this.tacheService.createPieceTemporaire(this.piece.codeTache, this.dossier, this.piece);
    } else {
      this.tacheService.demandeNouvellePiece(this.piece);
    }
    // cloture de la pièce NON CONFORME/
    
    this.tacheService.closePieceNonConforme(this.piece.ident, this.recuperationMotif());


    this.motifselected = [];
    this.toastr.success('Demande de renouvellement effectuée');
    this.currentModal.close();
    this.docSuivant();

    }else {
      this.toastr.error('Veuillez sélectionner un ou plusieurs motif(s)');
    }
  }

}

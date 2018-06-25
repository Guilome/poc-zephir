import {Component, OnInit} from '@angular/core';
import {Tache, Status, Nature} from '../../shared/domain/Tache';
import {ActivatedRoute, Router } from '@angular/router';
import {TacheService} from '../../shared/services/tache.service';
import {ToastrService} from 'ngx-toastr';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { UtilisateurService } from '../../shared/services/utilisateur.service';
import { GroupeService } from '../../shared/services/groupe.service';
import { CodeGroupe } from '../../shared/domain/Groupe';

@Component({
  selector: 'app-traitement-tache',
  templateUrl: './traitement-tache.component.html',
  styleUrls: ['./traitement-tache.component.css']
})
export class TraitementTacheComponent implements OnInit {

  showDetail = true;
  dossier: Tache;
  currentTache: Tache;
  listPieces = [];
  listActionsMetier= [];
  listNotes = [];
  // multiplSelect
  piecesComplementaires = [];
  selectedItems = [];
  dropdownSettings = {};
  private currentModal: NgbModalRef;
  statutDossier: string;
  private boolVerification: boolean = false;
  constructor(private tacheService: TacheService,
              private groupeService: GroupeService,
              private route: ActivatedRoute,
              private router: Router, 
              public toastr: ToastrService,
              private utilisateurService: UtilisateurService,
              private modalService: NgbModal) { }

  ngOnInit() {
    

    this.route.params.subscribe((params: any) => {

      // Status 
      this.dossier = this.tacheService.getDossierByIdContext(+params.id, +localStorage.getItem('USER'));

      // liste des pieces :
      if( this.dossier != null){

          this.tacheService.listerTaches()
          .subscribe(data => {
                              this.listNotes = this.tacheService.getNotesByDossier(this.dossier.ident);
                              this.listPieces = this.tacheService.getPiecesByDossier(this.dossier.ident);
                              //this.currentPiece = this.tacheService.getPieceById(+params.piece);
                              this.currentTache = this.tacheService.getTacheById(+params.piece);
                              // list des actions métiers 
                              this.listActionsMetier = this.tacheService.getActionMetierByDossier(this.dossier.ident)
                            });


      }

    });
    // without Subscribe
    if( this.dossier != null){
        this.statutDossier = this.tacheService.getStatutTache(this.dossier);
        this.boolVerification = this.statutDossier === Status.A_VERIFIER
    }

    // Multiple select piece complementaire :
    this.piecesComplementaires = [
      {"id": 'ATT_CI', "itemName":"Carte d'identité"},
      {"id": 'ATT_MDP', "itemName":"Mandat de prélèvement"}
    ];
    this.selectedItems = [];
    this.dropdownSettings = { 
              singleSelection: false, 
              text:"Selectionner une ou plusieurs pièce(s)",
              selectAllText:'Tout Selectionner',
              unSelectAllText:'Tout désélectionner',
              enableSearchFilter: true,
              classes:"myclass custom-class"
            };
  }

  ngAfterViewInit() {
    this.route.params.subscribe((params: any) => {
      if ( this.dossier != null){
          const element = document.getElementsByClassName('bg-row')[0];
          if(element != null) {
            element.classList.remove('bg-row')
          }
          document.getElementById('link'+ params.piece).classList.add('bg-row');
          if ( this.tacheService.isPiece(+params.piece)){
            document.getElementById('span'+ params.piece).classList.add('spanStatus');
          }
      }

    });

    if ( this.dossier != null) {
      const idLabelStatus = document.getElementById('idLabelStatus');
      idLabelStatus.innerHTML = '<span style="color: green">OK</span>'
            if(this.tacheService.getStatutTache(this.dossier) === Status.A_VERIFIER || this.tacheService.getStatutTache(this.dossier) === Status.EN_ATTENTE )  {
                idLabelStatus.innerHTML = '<span style="color: #ffc520">Vérification</span>';
              } else if (this.tacheService.getStatutTache(this.dossier) === Status.A_VALIDER) {
                idLabelStatus.innerHTML = '<span style="color: #00b3ee">Validation</span>';
              } 
           else {
              idLabelStatus.innerHTML = '<span style="color: red">Dossier non existant</span>';
            }
      }
  }

  detailPiece(piece: Tache,a, sp?) {
    
    this.router.navigate(['/TraitementTache', { id: piece.context.ident, piece: piece.ident }]);
    //this.router.navigate(['/TraitementTache/'+ident+';idPiece='+ident]);
    const element = document.getElementsByClassName('bg-row')[0];
    if(element != null) {
        element.classList.remove('bg-row');
        if (this.tacheService.getStatutTache(this.dossier) != Status.A_VERIFIER) {
           for (let i = 0 ; i <document.getElementsByClassName('spanStatus').length ; i++ ){
                const ele = document.getElementsByClassName('spanStatus')[i];
                if (ele.innerHTML.toString().indexOf(Status.A_VALIDER) > 0){
                       ele.innerHTML = '<span class="badge badge-success float-right">Visualisée</span>';
                }
           }
           if (sp != null)
            sp.classList.add('spanStatus');
        } 
    }
    a.classList.add('bg-row');
  }    

  /**
   * Valider le dossier 
   */
  valider() {  
    if (this.tacheService.listPieceEnAttente.length > 0 && this.tacheService.getActionMetierByDossier(this.dossier.ident).length == 0){
      if ( this.tacheService.getStatutTache(this.dossier) === 'En attente'){
        this.toastr.success("Le dossier a été mis <b>En attente</b>",'', {enableHtml: true});
        this.tacheService.affecterTacheUtilisateur(this.dossier, null)

      }else {
        this.toastr.success("Le dossier a été déplacé à la bannette <b>Vérification</b>",'', {enableHtml: true});
      }
      this.tacheService.addTacheEnAttente(this.dossier);
    } else if (this.tacheService.getActionMetierByDossier(this.dossier.ident).length > 0) { // Si demande d'avenant
      // Ajout toute les demande d'avenant
      this.tacheService.getActionMetierByDossier(this.dossier.ident).forEach(am => this.tacheService.addTacheEnAttente(this.tacheService.getDossierById(am.idTacheMere)))
      // Transfert le dossier au groupe AVN
      this.tacheService.affecterTacheGroupe(this.dossier, this.groupeService.getGroupeByCode(CodeGroupe.AVT))
      this.tacheService.affecterTacheUtilisateur(this.dossier, null)
      this.toastr.success("Le dossier a été déplacé dans la bannette Avenant");
    }     
    else {
        this.tacheService.closeDossier(this.dossier.ident)
        this.tacheService.affecterTacheUtilisateur(this.dossier, null)
        this.toastr.success("Le dossier a été validé");
    }
    this.router.navigate(['/gestionBO']);
  }

  refuser() {      
    this.tacheService.affecterTacheGroupe(this.dossier, this.groupeService.getGroupeByCode(CodeGroupe.REF))
    this.tacheService.affecterTacheUtilisateur(this.dossier, null)
    this.tacheService.closeDossier(this.dossier.ident)
    this.toastr.warning("Le dossier a été refusé")
    this.router.navigate(['/gestionBO']);
  }

  getDossierStatut(): string {
    if ( this.dossier != null){
      return this.statutDossier;
    }
    return '';
  }

  openModal(content: any) {
    this.currentModal = this.modalService.open(content, { size : 'lg', 
                                      centered : true, 
                                      keyboard: false, 
                                      backdrop: 'static' });
  
  }

  DemanderPiece() {

    let lPieces = '';
    for (let val of this.selectedItems){
      lPieces += val.itemName + '\n';
    }
    if (this.selectedItems.length < 1){
      this.toastr.error('Veuillez sélectionner une ou plusieurs pièce(s)')
    }else {
        if(confirm('Confirmez-vous la demande de cette/ces pièce(s) ?\n' + lPieces )){ 
          for (let val of this.selectedItems){
              this.tacheService.createTacheTemporaire(val.id, this.dossier, Nature.PIECE);
              if ( this.boolVerification ) {
                this.tacheService.viderTacheTemporaire();
              }
          }
          this.currentModal.close();
      }
    }    
  }

  Statut(): string {
    return this.tacheService.getStatutTache(this.dossier);
  }

  AjouterNote(message: any) {
    if(message.value != ''){
      // traitement 
      this.tacheService.createNote(this.dossier, message.value);
      this.currentModal.close();
    } else {
      this.toastr.error('Veuillez rensigner une note')
    }
  }

  /**
   * Retourne le nom de l'utilisateur qui a ajouté la note
   * @param note 
   */
  getNomUtilisateur(note: Tache): string  {
    return this.utilisateurService.getName(note.utilisateur.ident);
  }

  ngOnDestroy($event:Event)	{
    /*confirm('Confirmation ?');
    event.preventDefault();
    event.defaultPrevented;
    event.stopImmediatePropagation();
    event.stopPropagation();*/
  }

  isPiece(): boolean {
    
    return this.tacheService.isPiece(this.currentTache.ident);
  }

}

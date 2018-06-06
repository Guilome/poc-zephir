import {Component, Input, OnInit} from '@angular/core';
import {Tache} from '../../shared/domain/Tache';
import {ActivatedRoute, Router, Params} from '@angular/router';
import {TacheService} from '../../shared/services/tache.service';
import {NgForm} from '@angular/forms';
import { ActionMetierService } from '../../shared/services/action-metier.service';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-traitement-tache',
  templateUrl: './traitement-tache.component.html',
  styleUrls: ['./traitement-tache.component.css']
})
export class TraitementTacheComponent implements OnInit {

  showDetail = true;
  dossier: Tache
  listPieces = [];
  listActionsMetier= [];

  constructor(private tacheService: TacheService,
              private actionMetierService: ActionMetierService,
              private route: ActivatedRoute,
              private router: Router, 
              public toastr: ToastrService) { }

  ngOnInit() {
    this.route.params.subscribe((params: any) => {
      // liste des pieces :
      this.listPieces = this.tacheService.getPiecesByIdContext(+params.id);
      // list des actions métiers 
      this.actionMetierService.getAllByIdContext(+params.id).subscribe(data => this.listActionsMetier = data);
      // Status 
      this.dossier = this.tacheService.getDossierByIdContext(+params.id, +localStorage.getItem('USER'))
      
      let idLabelStatus = document.getElementById('idLabelStatus');
      idLabelStatus.innerHTML = '<span style="color: green">OK</span>'
      if (this.dossier != null){
        console.log(this.dossier.ident);
        
        for (let p of this.listPieces) {
          if(this.tacheService.getStatutDossier(this.dossier.ident) === 'À vérifier') {
            idLabelStatus.innerHTML = '<span style="color: #ffc520">Vérification</span>';
            return;
          }
          if (this.tacheService.getStatutDossier(this.dossier.ident) === 'À valider') {
            idLabelStatus.innerHTML = '<span style="color: #00b3ee">Validation</span>';
          }
        }
      } else {
        idLabelStatus.innerHTML = '<span style="color: red">Dossier non existant</span>'
      }
    });
  }

  ngAfterViewInit() {
    this.route.params.subscribe((params: any) => {
      
      const element = document.getElementsByClassName('bg-row')[0];
      if(element != null) {
        element.classList.remove('bg-row')
      }
      document.getElementById('link'+ params.piece).classList.add('bg-row');
    });
  }

  detailPiece(piece: Tache,a) {
    this.router.navigate(['/TraitementTache', { id: piece.context.ident, piece: piece.ident }]);
    //this.router.navigate(['/TraitementTache/'+ident+';idPiece='+ident]);
    const element = document.getElementsByClassName('bg-row')[0];
    if(element != null) {
      element.classList.remove('bg-row')
    }
    a.classList.add('bg-row');   
  }    

  valider() {  
    this.tacheService.closeDossier(this.dossier.ident)
    this.toastr.success("Le dossier a été validé")
    this.router.navigate(['/gestionBO']);
  }

  refuser() {
    this.tacheService.closeDossier(this.dossier.ident)
    this.toastr.warning("Le dossier a été refusé")
    this.router.navigate(['/gestionBO']);
  }

  getDossierStatut(): string {
    return this.tacheService.getStatutDossier(this.dossier.ident);
  }
}

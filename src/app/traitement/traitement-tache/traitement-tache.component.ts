import {Component, Input, OnInit} from '@angular/core';
import {Tache} from '../../shared/domain/Tache';
import {ActivatedRoute, Router, Params} from '@angular/router';
import {TacheService} from '../../shared/services/tache.service';
import {NgForm} from '@angular/forms';
import { ActionMetierService } from '../../shared/services/action-metier.service';

@Component({
  selector: 'app-traitement-tache',
  templateUrl: './traitement-tache.component.html',
  styleUrls: ['./traitement-tache.component.css']
})
export class TraitementTacheComponent implements OnInit {

  showDetail = true;
  listPieces = [];
  listActionsMetier= [];

  constructor(private tacheService: TacheService,
              private actionMetierService: ActionMetierService,
              private route: ActivatedRoute,
              private router: Router) { }

  ngOnInit() {

    this.route.queryParams.subscribe((params: Params) => {
      console.log(params);
    });

    this.route.params.subscribe((params: any) => {
      const tache = this.tacheService.getTacheById(+params.id);
      console.log(params);
      // liste des pieces :
      this.listPieces = this.tacheService.getPiecesByIdContext(+params.id);
      // list des actions métiers 
      this.actionMetierService.getByContext(tache.context).subscribe(data => this.listActionsMetier = data);
      // Status 
      let idLabelStatus = document.getElementById('idLabelStatus');
      idLabelStatus.innerHTML = '<span style="color: green">OK</span>'
      for (let p of this.listPieces) {
        if(p.status === 'À vérifier') {
          idLabelStatus.innerHTML = '<span style="color: #ffc520">Vérfication</span>';
          return;
        }
        if (p.status === 'À valider') {
          idLabelStatus.innerHTML = '<span style="color: #00b3ee" >Validation</span>';
        }
      }
    });
  }

  detailPiece(ident: number) {
    this.router.navigate(['/TraitementTache/'+ident]);
  }



}

import {Component, Input, OnInit} from '@angular/core';
import {Tache} from '../../../shared/domain/Tache';
import {ActivatedRoute} from '@angular/router';
import {TacheService} from '../../../shared/services/tache.service';
import {Subscription} from 'rxjs/Subscription';
import {TitreService} from '../../../shared/services/titre.service';

@Component({
  selector: 'app-detail-tache',
  templateUrl: './detail-tache.component.html',
  styleUrls: ['./detail-tache.component.css']
})
export class DetailTacheComponent implements OnInit {

  tache: Tache;
  private idSubscription: Subscription;

  constructor(private tacheService: TacheService,
              private route: ActivatedRoute,
              private titreService: TitreService) {
  }

  ngOnInit() {
    this.idSubscription = this.route.params.subscribe((params: any) => {
      if(params.idPiece != null){
        this.tache = this.tacheService.getTacheById(+params.idPiece);
      }
    });

    /* TITRE 
    if ( this.tache.status.toLowerCase() === 'à vérifier') {
      this.titreService.updateTitre('Tâche de vérification');
    } else if ( this.tache.status.toLowerCase() === 'à valider' ) {
      this.titreService.updateTitre('Tâche de validation');
    }*/
  }

}

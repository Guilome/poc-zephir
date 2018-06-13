import {Component, OnInit} from '@angular/core';
import {Tache} from '../../../shared/domain/Tache';
import {ActivatedRoute} from '@angular/router';
import {TacheService} from '../../../shared/services/tache.service';
import {Subscription} from 'rxjs/Subscription';

@Component({
  selector: 'app-detail-tache',
  templateUrl: './detail-tache.component.html',
  styleUrls: ['./detail-tache.component.css']
})
export class DetailTacheComponent implements OnInit {

  tache: Tache;
  private idSubscription: Subscription;

  constructor(private tacheService: TacheService,
              private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.idSubscription = this.route.params.subscribe((params: any) => {
      if(params.piece != null){
        this.tache = this.tacheService.getTacheById(+params.piece);
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

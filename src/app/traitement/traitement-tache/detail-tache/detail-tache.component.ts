import {Component, Input, OnInit} from '@angular/core';
import {Tache} from '../../../shared/domain/Tache';
import {ActivatedRoute} from '@angular/router';
import {TacheService} from '../../../shared/services/tache.service';

@Component({
  selector: 'app-detail-tache',
  templateUrl: './detail-tache.component.html',
  styleUrls: ['./detail-tache.component.css']
})
export class DetailTacheComponent implements OnInit {

  tache: Tache;

  constructor(private tacheService: TacheService,
              private route: ActivatedRoute) {
  }

  ngOnInit() {
    const id = this.route.snapshot.params['id'];
    this.tache = this.tacheService.getTacheById(+id);
    console.log(this.tache);
    console.log(id);

  }

}

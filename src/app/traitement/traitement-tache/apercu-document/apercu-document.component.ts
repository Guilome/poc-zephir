import {Component, Input, OnInit} from '@angular/core';
import {Tache} from '../../../shared/domain/Tache';
import {TacheService} from '../../../shared/services/tache.service';
import {ActivatedRoute} from '@angular/router';
import {DomSanitizer} from '@angular/platform-browser';
import {Subscription} from 'rxjs/Subscription';

@Component({
  selector: 'app-apercu-document',
  templateUrl: './apercu-document.component.html',
  styleUrls: ['./apercu-document.component.css']
})
export class ApercuDocumentComponent implements OnInit {

  tache: Tache;
  private idSubscription: Subscription;
  constructor(private tacheService: TacheService,
              private route: ActivatedRoute, private sanitizer: DomSanitizer) {
  }

  ngOnInit() {
    this.idSubscription = this.route.params.subscribe((params: any) => {
      this.tache = this.tacheService.getTacheById(+params.id);
      document.getElementById('divPdf').innerHTML = 
      '<object data="'+ this.tache.urlDocument +'" width="100%" height="800px" type="application/pdf"></object>'  
    });
  }

  // transformation URL
  urlSafe() {
    return this.sanitizer.bypassSecurityTrustResourceUrl(this.tache.urlDocument);
  }

}

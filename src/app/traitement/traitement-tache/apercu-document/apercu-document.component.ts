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

  piece: Tache;
  private idSubscription: Subscription;
  constructor(private tacheService: TacheService,
              private route: ActivatedRoute, private sanitizer: DomSanitizer) {
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.idSubscription = this.route.params.subscribe((params: any) => {
      if( params.piece != null) {
          this.piece = this.tacheService.getPieceById(+params.piece);
          document.getElementById('divPdf').innerHTML = 
          '<object data="'+ this.piece.urlDocument +'" width="100%" height="800px" type="application/pdf"></object>' ;
      }
    });
  }

  // transformation URL
  /*urlSafe() {
    return this.sanitizer.bypassSecurityTrustResourceUrl(this.piece.urlDocument);
  }*/

}

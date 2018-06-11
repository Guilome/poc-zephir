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
  note: Tache;
  private idSubscription: Subscription;
  constructor(private tacheService: TacheService,
              private route: ActivatedRoute, private sanitizer: DomSanitizer) {
  }

  ngOnInit() {
    this.idSubscription = this.route.params.subscribe((params: any) => {
      if( params.piece != null) {
          const idPiece = +params.piece;
          this.piece = this.tacheService.getPieceById(idPiece);
          this.note = this.tacheService.getNoteById(idPiece);
      }
    });
  }

  ngAfterViewInit() {
    this.idSubscription = this.route.params.subscribe((params: any) => {
    if(this.piece != null) {  
        if (this.piece.urlDocument != null) {
            document.getElementById('divPdf').innerHTML = '<object data="'
                                                          + this.piece.urlDocument 
                                                          +'" width="100%" height="800px" type="application/pdf"></object>' ;
        }else {
          document.getElementById('divPdf').innerHTML = 'Pièce en attente de réception';
        }
    } else if (this.note != null ) {
      document.getElementById('divPdf').innerHTML = this.note.message;
    }
    });

  }

  // transformation URL
  /*urlSafe() {
    return this.sanitizer.bypassSecurityTrustResourceUrl(this.piece.urlDocument);
  }*/

}

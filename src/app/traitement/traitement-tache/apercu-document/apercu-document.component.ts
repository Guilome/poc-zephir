import {Component, OnInit} from '@angular/core';
import {Tache, Nature} from '../../../shared/domain/Tache';
import {TacheService} from '../../../shared/services/tache.service';
import {ActivatedRoute} from '@angular/router';
import {Subscription} from 'rxjs/Subscription';
import { UtilisateurService } from '../../../shared/services/utilisateur.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-apercu-document',
  templateUrl: './apercu-document.component.html',
  styleUrls: ['./apercu-document.component.css']
})
export class ApercuDocumentComponent implements OnInit {

  piece: Tache;
  note: Tache;
  actionMetier: Tache;
  private idSubscription: Subscription;

  constructor(private tacheService: TacheService,
              private route: ActivatedRoute, 
              private utilisateurService: UtilisateurService,
              ) {
  }

  ngOnInit() {
    this.idSubscription = this.route.params.subscribe((params: any) => {
      if( params.piece != null) {
          const idPiece = +params.piece;
          const tache = this.tacheService.getTacheById(idPiece); // peut être PIECE / TACHE / NOTE
          if (tache != null) {
              this.piece = tache.nature === Nature.PIECE ? tache : null;
              this.note = tache.nature === Nature.NOTE ? tache : null;
              this.actionMetier = tache.nature === Nature.TACHE ? tache : null;
         }
          
          if(this.piece != null) {  
            if (this.piece.urlDocument != null ) {
                document.getElementById('divPdf').innerHTML = '<object data="'
                                                              + this.piece.urlDocument 
                                                              +'" width="100%" height="800px" type="application/pdf"></object>' ;
            }else {
               document.getElementById('divPdf').innerHTML = 'Pièce en attente de réception';
            }
        } else if (this.note != null || this.actionMetier != null) {
          document.getElementById('divPdf').innerHTML = '';
        }
      }
    });
  }


  // transformation URL
 /* urlSafe() {//              private sanitizer: DomSanitizer

    return this.sanitizer.bypassSecurityTrustResourceUrl(this.piece.urlDocument);
  }*/

  /**
   * retourn le nom de celui qui a émit la note 
   */
  public getName(): string{
    return this.utilisateurService.getName(this.note.utilisateur.ident);
  }

}

import { Injectable } from '@angular/core';
import { Modification, Donnee } from '../domain/Modification';
import { BehaviorSubject} from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { TacheService } from './tache.service';

@Injectable()
export class ModificationService {

  listModifications: Modification[] = [];
  // données en mémoire
  modificationSubject: BehaviorSubject<Modification[]> = new BehaviorSubject([]);


  constructor(private tacheService: TacheService) { }

  listerModication(): Observable<Modification[]> {
    return this.modificationSubject;
  }

  public getModificationById(idModif: number): Modification{
    return this.listModifications.filter(m => m.ident == idModif)[0]
  }

  public getModificationByPiece(idPiece: number): Modification[]{
    return this.modificationSubject.value.filter(m => m.idTache == idPiece);
    //return this.listModifications.filter(m => m.idTache == idPiece);
  }

  public getModificationByDossier(idDossier: number): Modification[]{
    return this.listModifications.filter(modif => this.tacheService.getPieceById(modif.idTache).idTacheMere == idDossier)
  }
  
  ajoutModification(modif: Modification) {
    if (this.listModifications.length == 0) {
      modif.ident = 1
    }
    else {
      modif.ident = this.listModifications[(this.listModifications.length - 1)].ident + 1;
    }    
    this.listModifications.push(modif);
    this.modificationSubject.next(this.listModifications);
  }

  supprimerModif(modif: Modification){
    this.listModifications.splice(this.listModifications.indexOf(modif),1)
    this.modificationSubject.next(this.listModifications);
  }

  /**
   * retourne la modification par rapport au type de donnée modifié
   * @param donnee 
   */
  getModifByDonnee(donnee: Donnee): Modification {
    return this.listModifications.find(m => m.donnee == donnee)
  }
}

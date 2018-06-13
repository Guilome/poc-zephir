import {Context} from './context';


export class Tache {
  //
  static libCode = new Map()
    .set('ATT_CG', 'Carte grise')
    .set('ATT_PERMIS', 'Permis de conduire')
    .set('AVENANT', 'Demande d\'avenant')
    .set('RESILILATION', 'Résiliation')
    .set('NOTE', 'Note')
    .set('NOTE_INTERNE', 'Note Interne')
    .set('ATT_RI','Relevé d\'information')
    .set('ATT_MANDAT', 'Mandat de prélèvement')
    .set('DEV', 'Devis à valider')
    .set('DEV_AFN','Devis à concrétiser en AFN')
    .set('DEV_AVT','Devis d\'avenant à valider')
    .set('RESIL','Demande de résiliation')
    .set('SANS_EFFET','Demande de sans effet')
    .set('199_AFN', 'Dossier 199')
    .set('ATT_CI', 'Carte d\'identié')
    .set('ATT_MDP', 'Mandat de prélèvement');

  //
  constructor(public nature: Nature ) {
    //this.status = Status.EN_ATTENTE;
    this.dateCloture = null;
    this.message = null;
    this.idUtilisateurCloture = null;
    this.idUtilisateurVerification = null;
    this.motifNonConformite = null;
  }

  public ident: number;
  public code: string;
  public famille: string;
  public sousFamille: string;
  public message: string; // commentaire
  public priorite: number;
  public dateCreation: Date;
  public dateLimite: Date; // format DD/MM/YYYY hh:mm
  public dateCloture: Date; // format DD/MM/YYYY hh:mm
  //public status: Status;
  public urlDocument: string;
  public conformite: boolean;
  public motifNonConformite: string;
  public context: Context;
  public idTacheMere: number;
  public idUtilisateurVerification: number;
  public idUtilisateurCloture: number;
  public dateReception: Date;
  public dateVerification: Date;
  idUtilisateur: number;
  idGroupe: number;

  get libelle(): string {
    return Tache.libCode.get(this.code);
  }


  get status(): string {
    // PIECE
    if (this.nature === Nature.PIECE){
      
        if (this.dateReception == null) {
          return Status.EN_ATTENTE;
        }else if ( this.dateVerification != null ) {
            if (this.motifNonConformite == null && this.dateCloture ==  null) {
                 return Status.A_VALIDER;
            } else {
              return Status.NON_CONFORME;
            }
        } else if (this.dateCloture != null) {
          return Status.OK;
        }        
        return Status.A_VERIFIER;
      }

    // NOTE deux statut : 'En attente'/ 'OK'
    if (this.nature === Nature.NOTE) {

      if (this.dateCloture != null) {
        return Status.OK;
      }
      return Status.EN_ATTENTE;

    }

      return Status.EN_ATTENTE;
    }
  }


export enum Nature {
  TACHE = 'Tâche',
  PIECE = 'Piece',
  NOTE = 'Note',
  ALERTE = 'Alerte',
  DOSSIER = 'Dossier'
}
export enum Status {
  A_VERIFIER = 'À vérifier',
  A_VALIDER  = 'À valider',
  EN_ATTENTE = 'En attente',
  OK = 'Ok',
  NON_CONFORME = 'Non conforme'

}

/*
export enum Priorite {
  ZERO = 0,
  UN = 1,
  DEUX = 2,
  TROIS = 3,
  QUATRE = 4,
  CINQ = 5,
  SIX = 6,
  SEPT = 7,
  HUIT = 8,
  NEUF = 9,
  DIX = 10
}*/

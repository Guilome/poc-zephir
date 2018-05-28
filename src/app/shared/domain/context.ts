import { Contrat } from "./contrat";

export class Context {


  public numeroPrime: string;
  public numeroSinitre: string;
  public numeroReglement: string;
  public numeroContrat: string
   
   

  constructor(public ident: number, public nomAppelClient: string, public nomAppelIntermediaire: string , public contrat: Contrat) {}


}

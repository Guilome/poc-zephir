import { Contrat } from "./contrat";

export class Context {


  public numeroPrime: string;
  public numeroSinitre: string;
  public numeroReglement: string;
   
   

  constructor(public ident: number, public nomAppelClient: string, public nomAppelIntermediaire: string , public contrat: Contrat) { }


}

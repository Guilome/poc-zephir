export class Context {


  public numeroPrime: string;
  public numeroSinitre: string;
  public numeroReglement: string;

  constructor(public ident: number, public numeroContrat: string, public nomAppelClient: string, public nomAppelIntermediaire: string) {}


}

import { Pipe, PipeTransform } from '@angular/core';
import { Status } from '../domain/Tache';

@Pipe({
  name: 'statut'
})
export class StatutPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    if(value === Status.A_VALIDER){
      return `<span class="badge badge-info">${value} </span>`;
    }else if(value === Status.A_VERIFIER) {
    return `<span class="badge badge-warning">${value}</span>`;
    } else if (value === Status.OK) {
      return `<span class="badge badge-success">${value}</span>`;
    }

    return value;
  }

}

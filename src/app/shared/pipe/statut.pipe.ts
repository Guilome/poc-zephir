import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'statut'
})
export class StatutPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    if(value === 'À valider'){
      return `<span class="badge badge-info">${value} </span>`;
    }else if(value === 'À vérifier') {
    return `<span class="badge badge-warning">${value}</span>`;
    } else if (value === 'Ok') {
      return `<span class="badge badge-success">${value}</span>`;
    }

    return value;
  }

}

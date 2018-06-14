import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'statut'
})
export class StatutPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    if(value === 'À valider'){
      return `<span class="text-info">${value} </span>`;
    }else if(value === 'À vérifier') {
    return `<span class="text-warning">${value}</span>`;
    }

    return value;
  }

}

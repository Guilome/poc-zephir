import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'bannette'
})
export class BannettePipe implements PipeTransform {

  transform(value: string, args?: any): any {
    if( value === '199_AFN')
      return 'Affaire nouvelle';
    else if (value === 'RES')
      return 'Résiliation';
    else if (value === 'REF')
      return 'Refus';
    else if (value === 'AVN')
      return 'Avenant';

    return value;
  }

}

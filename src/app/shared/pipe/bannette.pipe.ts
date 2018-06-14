import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'bannette'
})
export class BannettePipe implements PipeTransform {

  transform(value: string, args?: any): any {
    if( value === 'À vérifier')
      return 'Vérification';
    else if (value === 'À valider')
      return 'Validation';

    return value;
  }

}

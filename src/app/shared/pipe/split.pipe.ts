import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'split'
})
export class SplitPipe implements PipeTransform {

  transform(value: string, args?: any): string[] {
    console.log(value);
    console.log(value.split(args[0]))
    return value.split(args[0]);
  }

}

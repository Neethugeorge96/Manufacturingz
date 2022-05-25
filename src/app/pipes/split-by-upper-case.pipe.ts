import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'splitByUpperCase'
})
export class SplitByUpperCasePipe implements PipeTransform {

  transform(enumKey: string): string {
    if (enumKey)
      return enumKey.split(/(?=[A-Z])/).join(" ");
    return null
  }

}

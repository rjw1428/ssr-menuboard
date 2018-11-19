import { Pipe, PipeTransform } from '@angular/core';
import { isNumber } from 'util';

@Pipe({
  name: 'abv'
})
export class AbvPipe implements PipeTransform {

  transform(value: string | null): string {
    if (value == null)
      return null;

    if (+value == 0) {
      return null
    }

    if (value.length < 1) {
      return null
    }

    // if (value.indexOf("%") > 0)
    //   value=value.substr(0,value.indexOf("%"))
    if (isNumber(+value)) {
      var number = (+value)
      return number.toFixed(1) + "%"
    }

  }
}

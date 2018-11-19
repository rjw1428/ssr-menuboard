import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'featureTitle'
})
export class FeatureTitlePipe implements PipeTransform {

  transform(value: string | null): string {
    if (value == null)
      return null;

    let keyWordLocation = value.toLowerCase().indexOf("of the")
    if (keyWordLocation > 0) {
      return value.substr(0, keyWordLocation).trim() + '\n of the \n' + value.substr(keyWordLocation + 7).trim()
    } else return value
  }
}

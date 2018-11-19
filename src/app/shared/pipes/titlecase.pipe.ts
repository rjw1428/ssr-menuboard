import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'titlecase'
})
export class TitlecasePipe implements PipeTransform {

  transform(value: string): string {
    var output: string = '';
    var lowerValue = value.toLowerCase();
    var words = lowerValue.split(" ");
    words.forEach(word => {
      if (word.indexOf('ipa') > -1)
        output += word.toUpperCase();
      else if (word.indexOf('ibu') > -1)
        output += word.toUpperCase();
      else
        output += word.substr(0, 1).toUpperCase() + word.substr(1, value.length).toLowerCase() + " "
    })
    return output;
  }
}

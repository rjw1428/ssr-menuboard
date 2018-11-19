import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'featureMain'
})
export class FeatureMainPipe implements PipeTransform {

  transform(value: string | null): string {
    if (value == null)
      return null;

    let keyWordLocation = value.toLowerCase().indexOf("+")
    if (keyWordLocation > 0) {
      let words = value.split("+")
      // console.log("+ IS IN")
      let output = ''
      words.forEach(word => {
        output += word + '\n+\n'
      })
      return output.substr(0,output.length-3)
    } else
      return value
  }
}

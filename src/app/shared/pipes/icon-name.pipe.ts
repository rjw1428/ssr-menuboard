import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'iconName'
})
export class IconNamePipe implements PipeTransform {

  transform(value: string): string {
    let lowerName = value.toLowerCase().trim();
    let names = this.removeSpecialChars(lowerName).split("<>");
    
    //ADD SPECIAL BEER ICONS HERE
    if (names[1].indexOf("cali creamin")>-1) {
      return "cali creamin.png"
    } else if (names[1].indexOf("racer 5")>-1) {
      return "racer 5.png"
    }
    
    //PARSE COMPANY NAME TO CREATE ICON
    else 
    {
      let firstSlash = names[0].split("/")
      let words = firstSlash[0].split(" ");
      let keyWordLocation = words.indexOf("brewing")
      if (keyWordLocation > -1) {
        words.splice(keyWordLocation, 1);
      }

      keyWordLocation = words.indexOf('brewery')
      if (keyWordLocation > -1) {
        words.splice(keyWordLocation, 1);
      }

      keyWordLocation = words.indexOf('beer')
      if (keyWordLocation > -1) {
        words.splice(keyWordLocation, 1);
      }
      keyWordLocation = words.indexOf('cider')
      if (keyWordLocation > -1) {
        words.splice(keyWordLocation, 1);
      }
      keyWordLocation = words.indexOf('co.')
      if (keyWordLocation > -1) {
        words.splice(keyWordLocation, 1);
      }
      
      keyWordLocation = words.indexOf('company')
      if (keyWordLocation > -1) {
        words.splice(keyWordLocation, 1);
      }

      keyWordLocation = words.indexOf('.')
      var parsedString = []
      words.forEach(word => {
        if (word.indexOf('.') > -1) {
          parsedString.push(word.substr(0, word.indexOf('.')))
        } else {
          parsedString.push(word)
        }
      })
      words = parsedString;


      if (words.length > 1) {
        return words[0] + ' ' + words[1] + '.png';
      } else {
        return words[0] + '.png'
      }
    }
  }

  removeSpecialChars(str: string): string {
    let result = str.toLowerCase()
    result = result.replace(/ü/g, "u")
    result = result.replace(/ä/g, "a")
    result = result.replace(/ö/g, "o")
    result = result.replace(/ß/g, "ss")
    result = result.replace(/ñ/g, "n")
    result = result.replace(/ë/g, "e")
    result = result.replace(/'/g, "")
    return result
  }

}

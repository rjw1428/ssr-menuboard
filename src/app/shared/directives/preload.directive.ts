import { Directive, Input, HostBinding } from '@angular/core';

@Directive({
  selector: 'img[default]',
  host: {
    '(error)': 'updateUrl()',
    '[src]': 'src'
  }
})
export class PreloadDirective {
  @Input() src: string;
  @Input() default: string;

  updateUrl() {
    console.log("IMAGE MISSING")
    //this.src = this.default;
  }
}

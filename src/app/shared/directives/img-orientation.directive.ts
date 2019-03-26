import { Directive, Input, HostBinding, ElementRef, HostListener, Output, AfterViewInit, Renderer2, EventEmitter } from '@angular/core';
import { Upload } from '@shared/interfaces/upload';

@Directive({
  selector: '[sizeImg]',
  host: {
    // '(load)': setImageOrientation()
  }
})
export class ImgOrientationDirective {
  @Input() source: Upload;
  constructor(private el: ElementRef, private renderer: Renderer2) {
  }

  @HostListener('load') setOrientation() {
    if (this.source.sourceUrl.substring(this.source.sourceUrl.length - 4) != '.mp4') {
      var img = new Image()
      img.src = this.source.fbUrl
      if (img.width > img.height) {
        //LANDSCAPE
        this.renderer.addClass(this.el.nativeElement, 'full-width')
        this.renderer.removeClass(this.el.nativeElement, 'full-height')
      } else {
        //PORTRAIT
        this.renderer.addClass(this.el.nativeElement, 'full-height')
        this.renderer.removeClass(this.el.nativeElement, 'full-width')
      }
    }
  }
}

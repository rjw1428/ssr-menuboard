import { Directive, ElementRef, Input, OnInit } from '@angular/core';

@Directive({
  selector: '[appSlide]'
})
export class SlideDirective implements OnInit {
  @Input('appSlide') component: string
  constructor(public el: ElementRef) {
    this.el.nativeElement.insertAdjacentHTML('afterbegin', '<' + this.component + '></' + this.component + '>')
  }
  ngOnInit() {
    console.log('<' + this.component + '></' + this.component + '>')
    this.el.nativeElement.innerHTML += '<h1>' + this.component + '</h1>';

  }
}

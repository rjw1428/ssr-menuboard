import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[appScreenOrientation]'
})
export class ScreenOrientationDirective {
  screenHeight: number;
  screenWidth: number;
  @HostListener('window:resize', ['$event'])
  onResize(event?) {
    this.screenHeight = window.innerHeight;
    this.screenWidth = window.innerWidth;
    console.log("HERE2")
  }
  constructor() {
    // console.log("HERE")
    this.onResize()
    // if (this.screenWidth > this.screenHeight) {
    //   //LANDSCAPE
    //   console.log("L")
    // } else {
    //   //PORTRAIT
    //   console.log("P")
    // }
  }
}


import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { trigger, transition, animate, style, state } from '@angular/animations';
import { environment } from 'environments/environment'

@Component({
  selector: 'app-static',
  templateUrl: './static.component.html',
  styleUrls: ['./static.component.css'],
  animations: [
    trigger('fade', [
        transition(':enter', [
          style({ opacity: 0 }),
          animate('1s ease-in',
            style({ opacity: 1 }))
        ]),
        transition(':leave', [
          style({ opacity: 1 }),
          animate('1s ease-out',
            style({ opacity: 0}))
        ])
      // state('inactive', style({
      //   opacity: 0,
      // })),
      // state('active', style({
      //   opacity: 1,
      // })),
      // transition('* <=> *', animate('1s ease-in', style({ opacity: 1 })))
    ])
  ]
})
export class StaticComponent implements OnInit {
  @Input() delay: number;
  @Output() displayComplete = new EventEmitter<{}>()
  logo = environment.barLogo
  fadeControl: string = 'inactive';
  constructor() { }

  ngOnInit() {
    this.fadeControl = 'active'
    if (this.delay == null) {
      console.log("INFINITE")
    } else {
      setTimeout(() => {
        console.log("STATIC COMPLETE")
        this.displayComplete.emit();
      }, 1000 * this.delay)
    }
  }
}

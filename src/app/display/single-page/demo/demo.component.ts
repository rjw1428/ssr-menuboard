import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-demo',
  templateUrl: './demo.component.html',
  styleUrls: ['./demo.component.css']
})
export class DemoComponent implements OnInit {
  @Input() value: string
  constructor() { }

  ngOnInit() {
    console.log(this.value)
  }

}

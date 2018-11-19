import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ManagementService } from '@shared/services/management.service';
import { Property } from '@shared/interfaces/property';

@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.css']
})
export class TimerComponent implements OnInit {
  @Input() delay: number
  @Output() complete = new EventEmitter<{}>()

  //PROPERTIES
  active: boolean = false;
  color: string = 'transparent'
  height: number = 2
  direction: string = 'left'
  constructor(public ms: ManagementService) {
    this.ms.getTimerProperties().snapshotChanges().subscribe(props => {
      props.forEach(prop => {
        let x = prop.payload.toJSON()
        x['key'] = prop.key
        this.ms.parseProperties(x as Property)
      })
      this.height = +this.ms.timerHeight.value
      this.color = this.ms.timerColor.value
      this.direction = this.ms.timerDirection.value
      if (this.ms.timerOn.value=='on')
        this.active=true
      else this.active = false
    })
  }

  ngOnInit() {
    setTimeout(() => {
      this.complete.emit()
    }, 1000 * this.delay)
  }

  setBarProperties() {
    let style = {
      'background-color': this.color,
      'height': this.height + 'px',
      'animation': 'shrink ' + this.delay + 's linear',
      'float': this.direction
    }
    return style;
  }

  onClick() {
    console.log("CLICK")
  }
}

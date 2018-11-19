import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { SpecialsService } from '@shared/services/specials.service';
import { Specials } from '@shared/interfaces/specials';
import { ManagementService } from '@shared/services/management.service';
import { Observable } from 'rxjs/Rx';

@Component({
  selector: 'app-specials-page',
  templateUrl: './specials-page.component.html',
  styleUrls: ['./specials-page.component.css'],
  animations: [
  ]
})
export class SpecialsPageComponent implements OnInit {
  @Input() delay: number;
  @Input() activePage: number;
  @Output() displayStarted = new EventEmitter<{}>()
  @Output() displayComplete = new EventEmitter<{}>()
  header = "Test"
  specialsList: Specials[] = [];
  interval: any;
  active = true;
  constructor(private service: SpecialsService, private ms: ManagementService) {
    let observable = this.service.getSpecials().snapshotChanges().map(specials => {
      let list = [];
      specials.map(element => {
        var y = element.payload.toJSON();
        y['key'] = element.key
        list.push(y as Specials)
      })
      return list
    })
    observable.forEach((val) => {
      val.map((el: Specials) => this.specialsList.push(el))
    })
  }

  ngOnInit() {
    this.displayStarted.emit()
    console.log("SPECIALS STARTED")
    //SET COMPLETION INTERVAL
    if (this.delay == null) {
      console.log("INFINITE")
    } else {
      //OVERALL PAGE TIMER
      this.interval = setInterval(() => {
        console.log("SPECIALS COMPLETE")
        this.displayComplete.emit();
        this.active = false;
      }, 1000 * this.delay)
    }
  }

  ngOnDestroy() {
    if (this.interval)
      clearInterval(this.interval)
  }

  setHederStyle() {
    this.header = this.ms.specialHeader.value
    let style = {
      'font-size': this.ms.specialHeaderSize.value + 'px'
    }
    return style
  }
}


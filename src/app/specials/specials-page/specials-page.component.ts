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
  header = "Upcoming Events"
  specialsList: Specials[] = [];
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
  }

  setHederStyle() {
    // this.header = this.ms.specialHeader.value
    let style = {
      // 'font-size': this.ms.specialHeaderSize.value + 'px'
      'font-size': '50px'
    }
    return style
  }
}


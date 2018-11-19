import { Component, OnInit } from '@angular/core';
import {Observable} from 'rxjs/Rx';
import { ManagementService } from '@shared/services/management.service';
import { PreloaderService } from '@shared/services/preloader.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})

export class AppComponent implements OnInit {
  timeDelay = 10 //CHECK TIME EVERY x MIN TO SEE IF IT IS AFTER 4am (THEN WAIT 60 MIN & RESTART)
  constructor(public ms: ManagementService, public preloader: PreloaderService) {
    this.ms.initiateProperties()
  }
  ngOnInit() {
    var time = Observable.interval(60000 * this.timeDelay)
      .subscribe(x => {
        var date = new Date()
        if (date.getHours() == 4 && date.getMinutes() >= 0) {
          console.log("COUNTDOWN TO REFRESH STARTED")
          setTimeout(() => this.refresh(), 60000 * 60);
        } else console.log(date);
      })
  }

  refresh() {
    window.location.reload(true)
  }

}
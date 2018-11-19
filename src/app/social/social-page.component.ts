import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { SocialService } from '@shared/services/social.service';

@Component({
  selector: 'app-social-page',
  templateUrl: './social-page.component.html',
  styleUrls: ['./social-page.component.scss']
})
export class SocialPageComponent implements OnInit {
  @Input() delay: number;
  @Output() displayComplete = new EventEmitter<{}>()
  interval: any;
  constructor(public service: SocialService) { }

  ngOnInit() {
    //SET COMPLETION INTERVAL
    if (this.delay == null) {
      console.log("INFINITE")
    } else {
      //OVERALL PAGE TIMER
      this.interval = setInterval(() => {
        console.log("SOCIAL COMPLETE")
        this.displayComplete.emit();
      }, 1000 * this.delay)
    }
  }
  ngOnDestroy() {
    if (this.interval)
      clearInterval(this.interval)
    this.service.incrementPage();
  }
}

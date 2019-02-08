import { Component, OnInit, Input, HostListener, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { trigger, state, style, transition, animate, query, stagger } from '@angular/animations';
import { ManagementService } from '@shared/services/management.service';
import { AngularFireStorage } from '@angular/fire/storage';
import { AuthService } from '@shared/services/auth.service';

@Component({
  selector: 'app-display',
  templateUrl: './display.component.html',
  styleUrls: ['./display.component.css'],
  animations: [
    trigger('background', [
      transition('void => *', [
        style({ opacity: 0 }), animate(750, style({ opacity: .7 }))
      ])
    ]),
    trigger('logo', [
      state('normal', style({
        opacity: .3,
        transform: 'translate(0px, 0px) scale(1)',
      })), state('highlighted', style({
        opacity: 1,
        transform: 'translate(-25%, 0)  scale(1.3)'
      })),
      transition('normal <=> highlighted', animate("500ms ease-in"))
    ]),
  ],
  // host: { '[@background]': '' }
})
export class DisplayComponent implements OnInit {
  @Input() screenNum: number;
  @HostListener('window:resize', ['$event'])
  onResize(event?) {
    this.screenWidth = window.innerWidth;
    this.screenHeight = window.innerHeight;
  }
  screenWidth: number
  screenHeight: number
  consecFeatureNum: number = 2;
  screenKey: string;
  pageNum: number = 1;
  maxPages: number = 3;
  delay: number = 15;
  mode: string = 'none'

  bgUrl: string;
  logoUrl: string;
  logoState = "normal"
  startTimer: boolean = false
  constructor(public ms: ManagementService,
    private route: ActivatedRoute,
    public storage: AngularFireStorage,
    public userManagement: AuthService) {

    this.userManagement.defaultLogin()
    this.onResize();
  }

  ngOnInit() {
    let displayNum: number;
    this.route.params.subscribe((params: Params) => {
      displayNum = params['screen']
    });

    // this.screenKey = this.ms.setScreenName(displayNum);
    // this.ms.resetRefreshOnLoad(this.screenKey);
    // this.ms.setLastRefreshData(this.screenKey);
    // this.ms.setMachineActive(this.screenKey);
    // this.ms.storeScreenResolution(this.screenKey, this.screenWidth, this.screenHeight)
    // this.ms.checkForRefresh(this.screenKey);
    // this.ms.getConsecFeatureNum().snapshotChanges().subscribe(val => {
    //   val.map(prop => {
    //     this.consecFeatureNum = +prop.payload.val();
    //   })
    // })

    // this.ms.getTiming().snapshotChanges().subscribe(val => {
    //   val.forEach(prop => {
    //     if (prop.key == "value")
    //       this.delay = +prop.payload.val()
    //   })
    //   console.log("DELAY: " + this.delay)
    // })

    // this.ms.getState(this.screenKey).snapshotChanges().subscribe(val => {
    //   this.mode = 'none'
    //   val.map(prop => {
    //     if (prop.key == "static") {
    //       if (prop.payload.val() as boolean)
    //         this.mode = 'static'
    //     } else if (prop.key == "slideshow") {
    //       if (prop.payload.val() as boolean)
    //         this.mode = 'slideshow'
    //     } else if (prop.key == "trivia") {
    //       if (prop.payload.val() as boolean)
    //         this.mode = 'trivia'
    //     }
    //   })
    //   console.log('MODE: ' + this.mode)
    // })

    // setTimeout(() => {
    //   this.listenForClose()
    // }, 500)
  }

  nextPage() {
    if (this.pageNum == 2 || this.pageNum == 1) {
      setTimeout(() => {
        if (this.pageNum < this.maxPages) {
          this.pageNum++
        } else {
          this.pageNum = 1
        }
      }, 900)
    } else {
      if (this.pageNum < this.maxPages) {
        this.pageNum++
      } else {
        this.pageNum = 1
      }
    }
    this.toggleTimer()
  }

  logoAnimation() {
    this.logoState = "highlighted"
  }

  resetLogo() {
    this.logoState = "normal"
    this.nextPage()
  }

  listenForClose() {
    this.userManagement.disconnectUser(this.screenKey)
  }

  onClick() {
    // console.log("CLICK")
  }

  toggleTimer() {
    this.startTimer = false;
    setTimeout(() => {
      this.startTimer = true
    }, 100)
  }
}

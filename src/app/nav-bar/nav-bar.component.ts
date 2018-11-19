import { Component, OnInit, HostListener } from '@angular/core';
import { environment } from 'environments/environment'
import { ManagementService } from '@shared/services/management.service';
import { AngularFireDatabase } from '@angular/fire/database';
import { AuthService } from '@shared/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-menu',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})

export class NavBarComponent implements OnInit {
  @HostListener('window:resize', ['$event'])
  onResize(event?) {
    this.screenWidth = window.innerWidth;
  }
  toggleMenu = false;
  screenWidth: number
  isPaused: boolean
  isSlideshow: boolean
  isTrivia: boolean
  barName: string;
  userRole: string;
  constructor(private service: ManagementService, private authService: AuthService, private db: AngularFireDatabase, private router: Router) {
    this.onResize();
    this.barName = environment.barName;
  }

  ngOnInit() {
    this.service.setLastRefreshData('edit');
    this.getStatus()
    let username = this.authService.username
    this.db.list('users/' + username).snapshotChanges().subscribe(val => {
      val.forEach(user => {
        if (user.key == 'role') {
          this.userRole = user.payload.val() as string
        }
      })
      if (this.userRole == 'trivia')
        this.router.navigate(["/edit/trivia"])
    })
  }

  getStatus() {
    //GET SCREEN PAUSE STATUS
    this.service.getState('main').snapshotChanges().subscribe(val => {
      val.map(prop => {
        if (prop.key == "static") {
          this.isPaused = prop.payload.val() as boolean;
        } else if (prop.key == "slideshow") {
          this.isSlideshow = prop.payload.val() as boolean;
        } else if (prop.key == "trivia") {
          this.isTrivia = prop.payload.val() as boolean;
        }
      })
    })
  }

  pauseScreen() {
    console.log("PAUSE")
    if (this.isPaused == true) {
      this.isPaused = false
      this.service.stopStatic();
    } else {
      this.isPaused = true
      this.service.setStatic();
    }
  }

  slideshowOnly() {
    console.log("SLIDESHOW")
    if (this.isSlideshow == true) {
      this.isSlideshow = false
      this.service.stopSlideshow();
    } else {
      this.isSlideshow = true
      this.service.setSlideshow();
    }
  }

  triviaOnly() {
    console.log("TRIVIA")
    if (this.isTrivia == true) {
      this.isTrivia = false
      this.service.stopTrivia();
    } else {
      this.isTrivia = true
      this.service.setTrivia();
    }
  }

  onForceRefresh() {
    this.service.forceRefresh()
    alert("Refresh Command Sent")
  }

  onClick() {
    this.toggleMenu == true ? this.toggleMenu = false : this.toggleMenu = true
  }
}

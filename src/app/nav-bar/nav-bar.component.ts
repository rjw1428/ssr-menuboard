import { Component, OnInit, HostListener } from '@angular/core';
import { environment } from 'environments/environment'
import { ManagementService } from '@shared/services/management.service';
import { AngularFireDatabase } from '@angular/fire/database';
import { AuthService } from '@shared/services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import * as $ from 'jquery';
import { AngularFirestore, DocumentChangeAction } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { MatDialog, MatSnackBar } from '@angular/material';
import { SignupComponent } from '@auth/signup/signup.component';
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
  barName: Observable<string>;
  userRole: string;


  constructor(private service: ManagementService,
    private authService: AuthService,
    private db: AngularFireDatabase,
    private router: Router,
    private route: ActivatedRoute,
    private afs: AngularFirestore,
    public dialog: MatDialog,
    private snackBar: MatSnackBar) {
    this.onResize();
  }

  ngOnInit() {
    this.barName = this.route.params.pipe(
      switchMap(val => {
        let client = val['client'] as string
        return this.afs.collection('clients').doc(client).snapshotChanges().map(vals => {
          let obj = vals.payload.data() as { name: string }
          return obj.name
        })
      })
    )

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

  onRequest() {
    if (confirm("You are requesting support. Are you sure you want to submit this request?"))
      this.authService.user.switchMap(user => {
        let info = this.db.object(`users/${user.uid}`).snapshotChanges().map(el => {
          return el.payload.toJSON()
        })
        return info
      }).subscribe((user: { name: string, phoneNum: string, client: string, active: boolean, agent: string, lastConnected: string, role: string, username: string }) => {
        delete user.username
        delete user.role
        delete user.lastConnected
        delete user.agent
        this.afs.collection('error').add(user).then(ref => {
          console.log(ref.id)
        })
      })
  }

  openSignUpDialog() {
    const dialogRef = this.dialog.open(SignupComponent, {
      width: '500px',
      height: '75vh',
      disableClose: true,
      data: {}
    });


    //SET BEER DATA FROM FORM
    dialogRef.afterClosed()
      .subscribe(result => {
        if (result) {
          this.authService.signupUser(result)
        }
      })
    }

  onForceRefresh() {
    this.service.forceRefresh()
    alert("Refresh Command Sent")
  }

  onClick() {
    console.log("OH YEA")
    $('#navbarNav').collapse('hide');
  }
}

import { Injectable } from '@angular/core';
import 'firebase/auth'
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Observable, BehaviorSubject } from 'rxjs/Rx';
import { AngularFireAuth } from '@angular/fire/auth';
import { environment } from '@environments/environment.prod';
import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFirestore } from '@angular/fire/firestore';
import { first, switchMap, map } from 'rxjs/operators';
import { database } from 'firebase/app';
import { UsernamePipe } from '@shared/pipes/username.pipe';

export interface User {
  client: string;
  name: string;
  phoneNum: string;
  email: string;
  password: string;
  role: string;
  id?: string
}
@Injectable()
export class AuthService {
  user: Observable<firebase.User>;
  username: string
  token: string;
  client: any;
  constructor(private firebaseAuth: AngularFireAuth,
    private firebaseData: AngularFireDatabase,
    private firestore: AngularFirestore,
    private router: Router,
    private route: ActivatedRoute) {
    this.user = firebaseAuth.authState;
  }

  signupUser(newUser: User) {
    this.firebaseAuth.auth.createUserWithEmailAndPassword(newUser.email, newUser.password)
      .then(response => {
        delete newUser.password
        this.firebaseData.list('users/').set(response.user.uid, newUser)
        this.signinUser(newUser)
      })
      .then(() => {
        var actionCodeSettings = {
          url: 'https://' + environment.firebase.projectId + '.firebaseapp.com/?email=' + this.firebaseAuth.auth.currentUser.email,
          handleCodeInApp: true
        };
        this.firebaseAuth.auth.currentUser.sendEmailVerification(actionCodeSettings)
          .then(function () {
            alert("Authentication Email sent to: " + newUser.email)
          }).catch(function (error) {
            alert("Error occured while sending email verification.")
          });
      })
      .catch(error => {
        alert(error)
      })
  }

  defaultLogin() {
    this.firebaseAuth.auth.signInAnonymously().then((response) => {
      console.log(this.firebaseAuth.auth.currentUser.uid + ": CONNECTED")
    })
  }

  disconnectUser(screenKey: string) {
    database().ref().child('status/' + screenKey).onDisconnect().update({
      active: false
    })
    // if (this.firebaseAuth.auth.currentUser.isAnonymous)
    //   this.firebaseAuth.auth.currentUser.delete()
    this.firebaseAuth.auth.signOut();
  }

  signinUser(user: User) {
    this.firebaseAuth
      .auth
      .signInWithEmailAndPassword(user.email, user.password)
      .then(response => {
        this.username = new UsernamePipe().transform(user.email)
        this.firebaseAuth.auth.currentUser.getIdToken()
          .then((token: string) => this.token = token)
          .then(() => { this.updateUser(response.user) })
        this.firebaseData.object(`users/${response.user.uid}/client`).valueChanges().pipe(
          map(client => {
            return `edit/${client}/items`
          })).subscribe(val => {
            this.router.navigate([val])
          })
      })
      .catch(error => { alert(error) })
  }

  isAuthenticated() {
    return this.token != null;
  }

  isLoggedIn() {
    return this.firebaseAuth.authState.pipe(first()).toPromise()
  }

  getToken() {
    this.firebaseAuth.auth.currentUser.getIdToken()
      .then((token: string) => this.token = token)
    return this.token;
  }

  updateUser(user: firebase.User) {
    this.firebaseData.list('users/').update(user.uid, {
      lastConnected: this.timestamp(),
      agent: navigator.userAgent,
      active: 'true',
      //username: user.email
    })
    this.firebaseData.list('status/edit/').update('lastUpdate', {
      user: user.email
    }).then(() => {
      database().ref().child('users/' + user.uid).onDisconnect().update({
        active: 'false'
      })
    })
  }

  timestamp() {
    return new Date().toLocaleString('en-US', { timeZone: 'America/New_York' })
  }
}

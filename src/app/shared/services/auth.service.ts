import { Injectable } from '@angular/core';
import * as firebase from 'firebase/app';
import 'firebase/auth'
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Observable, BehaviorSubject } from 'rxjs/Rx';
import { AngularFireAuth } from '@angular/fire/auth';
import { environment } from '@environments/environment.prod';
import { AngularFireDatabase } from '@angular/fire/database';
import { UsernamePipe } from '@shared/pipes/username.pipe'
import { AngularFirestore } from '@angular/fire/firestore';
import { first, switchMap, map } from 'rxjs/operators';

export interface User {
  active: boolean;
  agent: string;
  client: string;
  lastConnected: string;
  name: string;
  username: string;
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

  signupUser(email: string, password: string, role: string) {
    this.firebaseAuth.auth.createUserWithEmailAndPassword(email, password)
      .then(response => {
        this.signinUser(email, password, role)
      })
      .then(() => {
        var actionCodeSettings = {
          url: 'https://' + environment.firebase.projectId + '.firebaseapp.com/?email=' + this.firebaseAuth.auth.currentUser.email,
          handleCodeInApp: true
        };
        this.firebaseAuth.auth.currentUser.sendEmailVerification(actionCodeSettings)
          .then(function () {
            alert("Authentication Email sent to: " + email)
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
      console.log(firebase.auth().currentUser.uid + ": CONNECTED")
    })
  }

  disconnectUser(screenKey: string) {
    firebase.database().ref().child('status/' + screenKey).onDisconnect().update({
      active: false
    })
    // if (this.firebaseAuth.auth.currentUser.isAnonymous)
    //   this.firebaseAuth.auth.currentUser.delete()
    this.firebaseAuth.auth.signOut();
  }

  signinUser(email: string, password: string, role?: string) {
    this.firebaseAuth
      .auth
      .signInWithEmailAndPassword(email, password)
      .then(response => {
        firebase.auth().currentUser.getIdToken()
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
    firebase.auth().currentUser.getIdToken()
      .then((token: string) => this.token = token)
    return this.token;
  }

  updateUser(user: firebase.User) {
    this.firebaseData.list('users/').update(user.uid, {
      lastConnected: this.timestamp(),
      agent: navigator.userAgent,
      active: 'true',
      username: user.email
    })
    this.firebaseData.list('status/edit/').update('lastUpdate', {
      user: user.email
    }).then(() => {
      firebase.database().ref().child('users/' + user.uid).onDisconnect().update({
        active: 'false'
      })
    })
  }

  timestamp() {
    return new Date().toLocaleString('en-US', { timeZone: 'America/New_York' })
  }
}

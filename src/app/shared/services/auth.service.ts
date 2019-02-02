import { Injectable } from '@angular/core';
import * as firebase from 'firebase/app';
import 'firebase/auth'
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { AngularFireAuth } from '@angular/fire/auth';
import { environment } from '@environments/environment.prod';
import { AngularFireDatabase } from '@angular/fire/database';
import { UsernamePipe } from '@shared/pipes/username.pipe'

@Injectable()
export class AuthService {
  user: Observable<firebase.User>;
  username: string
  token: string;
  constructor(private firebaseAuth: AngularFireAuth, private firebaseData: AngularFireDatabase, private router: Router) {
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
    this.username = new UsernamePipe().transform(email)
    this.firebaseAuth
      .auth
      .signInWithEmailAndPassword(email, password)
      .then(
        response => {
          firebase.auth().currentUser.getIdToken()
            .then(
              (token: string) => this.token = token
            ).then(() => {
              this.firebaseData.list('users/').update(this.username, {
                connected: this.timestamp(),
                agent: navigator.userAgent,
                active: 'true'
              })
              this.firebaseData.list('status/edit/').update('lastUpdate', {
                user: email
              })
            }).then(() => {
              firebase.database().ref().child('users/' + this.username).onDisconnect().update({
                active: 'false'
              })
            })
        })
      .then(response => {
        if (role == 'trivia')
          this.router.navigate(['/edit/trivia'])
        else
          this.router.navigate(['/edit/items'])
      })
      .catch(error => {
        alert(error)
      })
  }

  isAuthenticated() {
    return this.token != null;
  }

  getToken() {
    firebase.auth().currentUser.getIdToken()
      .then((token: string) => this.token = token)
    return this.token;
  }

  timestamp() {
    return new Date().toLocaleString('en-US', { timeZone: 'America/New_York' })
  }
}

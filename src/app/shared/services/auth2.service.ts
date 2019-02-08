import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireDatabase } from '@angular/fire/database';
import { Router } from '@angular/router';

export class User {
  client: string;
  role: any;

  constructor(authData) {
    this.client = authData.client
    this.role = { reader: true }
  }
}

@Injectable()
export class Auth2Service {
  user: BehaviorSubject<User> = new BehaviorSubject(null)
  constructor(
    private afAuth: AngularFireAuth,
    private db: AngularFireDatabase,
    private router: Router
  ) {
    this.afAuth.authState.switchMap(auth => {
      if (auth)
        return this.db.object(`users/${auth.uid}`).valueChanges()
      return Observable.of(null)
    }).subscribe(u => {
      this.user.next(u)
    })
  }

  signinUser(email: string, password: string, role?: string) {
    return this.afAuth.auth.signInWithEmailAndPassword(email, password)
      .then(response => {
        this.updateUser(response.user)
      }).then(() => {
        this.router.navigate(['/edit/beers'])
      })
      .catch(error => {
        alert(error)
      })
  }

  updateUser(authData) {
    const userData = new User(authData)
    const ref = this.db.object(`users/${authData.id}`)
    ref.valueChanges().take(1).subscribe((user: User) => {
      console.log(user)
      !user.role ? ref.update(userData) : null
    })
  }
}

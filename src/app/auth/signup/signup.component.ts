import { Component, OnInit } from '@angular/core';
import { NgForm, AbstractControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '@shared/services/auth.service';
import { Router } from '@angular/router';
import { AngularFireDatabase } from '@angular/fire/database';
import { UsernamePipe } from '@shared/pipes/username.pipe'

export class PasswordValidation {
  static MatchPassword(AC: AbstractControl) {
    let password = AC.get('password').value; // to get value in input tag
    let confirmPassword = AC.get('confirmPassword').value; // to get value in input tag
    if (password != confirmPassword) {
      AC.get('confirmPassword').setErrors({ MatchPassword: true })
    } else {
      return null
    }
  }
}

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  form: FormGroup
  showPasswordError: boolean = false;
  showEmailError: boolean = false;
  constructor(public authService: AuthService, private router: Router, private fb: FormBuilder, private db: AngularFireDatabase) {
    this.form = fb.group({
      email: ['', Validators.required],
      password: ['', Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(10)])],
      confirmPassword: ['', Validators.required],
      role: ['', Validators.required],
    }, {
        validator: PasswordValidation.MatchPassword
      })
  }

  ngOnInit() {
  }

  onSubmit() {
    if (this.form.controls.confirmPassword.status == 'INVALID')
      this.showPasswordError = true
    else {
      const email = this.form.value.email;
      const password = this.form.value.password;
      const role = this.form.value.role;

      this.db.database.ref('/users/' + new UsernamePipe().transform(email)).transaction(currentValue => {
        if (currentValue === null) {
          this.form.reset()
          this.authService.signupUser(email, password, role)
          return {
            'email': email,
            'role': role,
            'dateCreated': this.timestamp()
          };
        } else {
          this.showEmailError = true
        }
      })
    }
  }

  clearNameError() {
    this.showEmailError = false;
  }

  clearError() {
    this.showPasswordError = false;
  }

  onCancel() {
    this.router.navigate(["/edit/items"])
  }

  getUserName(email: string) {

  }

  timestamp() {
    return new Date().toLocaleString('en-US', { timeZone: 'America/New_York' })
  }
}

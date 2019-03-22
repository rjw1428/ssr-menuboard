import { Component, OnInit, Inject } from '@angular/core';
import { NgForm, AbstractControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '@shared/services/auth.service';
import { Router } from '@angular/router';
import { AngularFireDatabase } from '@angular/fire/database';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

export class PasswordValidation {
  static MatchPassword(AC: AbstractControl) {
    let password = AC.get('password').value; // to get value in input tag
    let confirmPassword = AC.get('confirmPassword').value; // to get value in input tag
    if (password != confirmPassword) {
      // console.log(password)
      // console.log(confirmPassword)
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
  constructor(
    public authService: AuthService, 
    private router: Router, 
    private fb: FormBuilder, 
    private db: AngularFireDatabase,
    public dialogRef: MatDialogRef<SignupComponent>,
    @Inject(MAT_DIALOG_DATA)
    public input: any,
    ) {
    this.form = fb.group({
      email: ['', Validators.required],
      password: ['', Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(20)])],
      confirmPassword: ['', Validators.required],
      role: ['', Validators.required],
      name: ['', Validators.required],
      phoneNum: ['', Validators.required],
      client: ['', Validators.required],
    }, {
        validator: PasswordValidation.MatchPassword
      })
  }

  ngOnInit() {
  }

  clearNameError() {
    this.showEmailError = false;
  }

  clearError() {
    this.showPasswordError = false;
  }

  onNoClick() {
    this.dialogRef.close()
  }

  onAdd() {
    let result=this.form.value
    delete result.confirmPassword
    return result
  }

  getUserName(email: string) {
    return this.form.value
  }

  timestamp() {
    return new Date().toLocaleString('en-US', { timeZone: 'America/New_York' })
  }
}

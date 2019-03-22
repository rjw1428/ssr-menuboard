import { Component, OnInit } from '@angular/core';
import { EmailValidator, NgForm, FormGroup, FormControl, Validators, FormControlName } from '@angular/forms';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {
  contactForm: FormGroup;
  submitted: boolean = false
  forbiddenNames = ['Test'];
  constructor(private firestore: AngularFirestore) { }

  ngOnInit() {
    this.contactForm = new FormGroup({
      'name': new FormControl(null, [Validators.required, this.checkNames.bind(this)]),
      'email': new FormControl(null, [Validators.required, Validators.email]),
      'location': new FormControl(null, [Validators.required]),
      'phoneNum': new FormControl(null, [Validators.required])
    });
    this.contactForm.statusChanges.subscribe(
      (status) => console.log(status)
    );
  }

  onSubmit() {
    if (this.contactForm.valid) {
      this.firestore.collection('website').doc('content').collection("contact").add({
        name: this.contactForm.value.name,
        location: this.contactForm.value.location,
        email: this.contactForm.value.email,
        phoneNum: this.contactForm.value.phoneNum,
        time: this.timestamp()
      })
      this.submitted = true
      this.contactForm.reset();
    }
  }

  onReset() {
    this.submitted = false;
  }

  timestamp() {
    return new Date().toLocaleString('en-US', { timeZone: 'America/New_York' })
  }

  emailCheck(control: FormControl): Promise<any> | Observable<any> {
    const promise = new Promise<any>((resolve, reject) => {
      setTimeout(() => {
        if (control.value === 'test@test.com') {
          resolve({ 'emailIsForbidden': true });
        } else {
          resolve(null);
        }
      }, 1500);
    });
    return promise;
  }

  checkNames(control: FormControl): { [s: string]: boolean } {
    if (this.forbiddenNames.indexOf(control.value) !== -1) {
      return { 'nameIsForbidden': true };
    }
    return null;
  }
}

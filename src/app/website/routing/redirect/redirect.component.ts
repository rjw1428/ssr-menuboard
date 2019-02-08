import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

interface Device {
  redirect: string;
  location: string;
  lastModified?: string;
}

@Component({
  selector: 'app-redirect',
  templateUrl: './redirect.component.html',
  styleUrls: ['./redirect.component.css']
})

export class RedirectComponent implements OnInit {
  path: string;
  constructor(private route: ActivatedRoute, ) {
  }

  ngOnInit() {
    let serialNum
    this.route.params.subscribe((params: Params) => {
      serialNum = params['serialnum']
    });
    //this.getRedirectAddress(serialNum)
  }

  // getRedirectAddress(serialNum) {
  //   return this.afs.collection('devices').snapshotChanges().subscribe((val) => {
  //     val.forEach(num => {
  //       console.log(num.payload)
  //     })
  //   });
  // }
  // .get().then((doc) => {
  //   let x = doc.data() as Device
  //   this.path = x.redirect
  //   //console.log(this.path)
  //   return this.path
  // })
  // this.afs.collection('devices').doc(serialNum).valueChanges().subscribe(value => {
  //   console.log(value)
  // })
  //}
}
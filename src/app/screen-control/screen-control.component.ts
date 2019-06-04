import { Component, OnInit } from '@angular/core';
import { DataService } from '@shared/services/data.service';
import { Observable } from 'rxjs';
import { ActivatedRoute, Params } from '@angular/router';
import { ScreenInfo } from '@shared/interfaces/screen';
import { validateConfig } from '@angular/router/src/config';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AngularFirestore } from '@angular/fire/firestore';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-screen-control',
  templateUrl: './screen-control.component.html',
  styleUrls: ['./screen-control.component.css']
})
export class ScreenControlComponent implements OnInit {
  screenInfo: Observable<ScreenInfo[]>
  client: string
  size: number
  systemOptions: FormGroup;
  constructor(
    private service: DataService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private afs: AngularFirestore,
    private snackBar: MatSnackBar,
  ) {
    this.systemOptions = this.fb.group({
      beerlistDelay: [10, Validators.min(5)],
      featuresDelay: [5, Validators.min(5)]
    })
  }

  ngOnInit() {
    this.screenInfo = this.route.parent.params.switchMap(val => {
      this.client = val['client']
      return this.service.getScreenInfo(val['client'])
    })
    this.screenInfo.subscribe(list => {
      this.size = list.length
      this.resetForm()
    })
  }

  add() {
    this.service.addScreen(this.client, String(this.size + 1))
  }

  resetForm() {
    this.afs.collection('clients').doc(this.client).collection('properties').doc('delay').snapshotChanges().map(properties => {
      return properties.payload.data()
    }).subscribe((props: { beerlist: number, features: number }) => {
      this.systemOptions.setValue({ beerlistDelay: props.beerlist, featuresDelay: props.features })
    })
  }

  saveForm() {
    this.afs.collection('clients').doc(this.client).collection('properties').doc('delay').update({
      features: this.systemOptions.get('featuresDelay').value,
      beerlist: this.systemOptions.get('beerlistDelay').value
    }).then(ref => {
      this.snackBar.open("System Properties updated!", "OK", {
        duration: 3000,
      })
    })
  }

}

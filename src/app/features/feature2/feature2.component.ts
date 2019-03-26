import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { FeaturesService } from '@shared/services/features.service';
import { environment } from '@environments/environment';
import { FeaturedItem } from '@shared/interfaces/featured-item';
import { ManagementService } from '@shared/services/management.service';
import { Observable } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';
import { DataService } from '@shared/services/data.service';
import { ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-feature2',
  templateUrl: './feature2.component.html',
  styleUrls: ['./feature2.component.css'],
})
export class Feature2Component implements OnInit {
  @Input() feature: FeaturedItem
  @Input() selected: boolean;
  @Input() edit: boolean = false
  logo: string;
  constructor(
    public service: DataService,
    public route: ActivatedRoute,
    public afs: AngularFirestore
  ) { }

  ngOnInit() {
    if (this.edit) {
      this.route.parent.params
        .switchMap(val => {
          let client = val['client'] as string
          return this.afs.collection('clients').doc(client).snapshotChanges().map(vals => {
            let obj = vals.payload.data() as { logo: string }
            return obj.logo
          })
        }).subscribe(val => {
          this.logo = val
        })
    } else {
      this.route.params
        .switchMap(val => {
          let client = val['client'] as string
          return this.afs.collection('clients').doc(client).snapshotChanges().map(vals => {
            let obj = vals.payload.data() as { logo: string }
            return obj.logo
          })
        }).subscribe(val => {
          this.logo = val
        })
    }
    // console.log(this.feature.layout)
  }
}

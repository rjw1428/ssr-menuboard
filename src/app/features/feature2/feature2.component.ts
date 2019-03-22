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
    // public featureService: FeaturesService, public ms: ManagementService
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

  setHeaderStyle() {
    let style = {
      // 'top': this.ms.featuredHeaderTop.value,
      // 'font-size': this.ms.featuredHeaderSize.value + 'px',
      // 'color': this.ms.featuredHeaderColor.value,
      // 'font-family': this.ms.featuredHeaderFont.value,
      // 'text-shadow': this.ms.featuredHeaderShadow.value,
      // 'letter-spacing': this.ms.featuredHeaderLetterSpace.value + 'px',
    }
    return style
  }

  setCaptionStyle() {
    let style = {
      // 'top': this.ms.featuredCaptionTop.value,
      // 'font-size': this.ms.featuredCaptionSize.value + 'px',
      // 'color': this.ms.featuredCaptionColor.value,
      // 'font-family': this.ms.featuredCaptionFont.value,
      // 'text-shadow': this.ms.featuredCaptionShadow.value,
      // 'letter-spacing': this.ms.featuredCaptionLetterSpace.value + 'px',
    }
    return style
  }

  setSubCaptionStyle() {
    let style = {
      // 'top': this.ms.featuredDescriptionTop.value,
      // 'font-size': this.ms.featuredDescriptionSize.value + 'px',
      // 'color': this.ms.featuredDescriptionColor.value,
      // 'font-family': this.ms.featuredDescriptionFont.value,
      // 'text-shadow': this.ms.featuredDescriptionShadow.value,
      // 'letter-spacing': this.ms.featuredDescriptionLetterSpace.value + 'px',
    }
    return style
  }

  setBannerStyle() {
    let style = {
      // 'width': this.ms.featuredBannerWidth.value + 'vw',
      // 'background-color': this.ms.featuredBannerColor.value
    }
    return style
  }
}

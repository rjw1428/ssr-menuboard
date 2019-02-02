import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { FeaturesService } from '@shared/services/features.service';
import { environment } from '@environments/environment';
import { FeaturedItem } from '@shared/interfaces/featured-item';
import { ManagementService } from '@shared/services/management.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-feature2',
  templateUrl: './feature2.component.html',
  styleUrls: ['./feature2.component.css']
})
export class Feature2Component implements OnInit {
  featuredList: FeaturedItem[] = []
  activeFeature: FeaturedItem
  activeNum: number;
  logo: string;
  isActive: boolean = false
  itterationCount: number = 0
  //@Input('start') startNum: number
  //@Input('step') stepNum: number
  //@Input('active') activePos: number
  //@Input() currentPos: number
  @Input() feature: FeaturedItem

  constructor(public featureService: FeaturesService, public ms: ManagementService) {
    this.logo = environment.barLogo;
    
  }

  ngOnInit() {

  }

  setHeaderStyle() {
    let style = {
      'top': this.ms.featuredHeaderTop.value,
      'font-size': this.ms.featuredHeaderSize.value + 'px',
      'color': this.ms.featuredHeaderColor.value,
      'font-family': this.ms.featuredHeaderFont.value,
      'text-shadow': this.ms.featuredHeaderShadow.value,
      'letter-spacing': this.ms.featuredHeaderLetterSpace.value + 'px',
    }
    return style
  }

  setCaptionStyle() {
    let style = {
      'top': this.ms.featuredCaptionTop.value,
      'font-size': this.ms.featuredCaptionSize.value + 'px',
      'color': this.ms.featuredCaptionColor.value,
      'font-family': this.ms.featuredCaptionFont.value,
      'text-shadow': this.ms.featuredCaptionShadow.value,
      'letter-spacing': this.ms.featuredCaptionLetterSpace.value + 'px',
    }
    return style
  }

  setSubCaptionStyle() {
    let style = {
      'top': this.ms.featuredDescriptionTop.value,
      'font-size': this.ms.featuredDescriptionSize.value + 'px',
      'color': this.ms.featuredDescriptionColor.value,
      'font-family': this.ms.featuredDescriptionFont.value,
      'text-shadow': this.ms.featuredDescriptionShadow.value,
      'letter-spacing': this.ms.featuredDescriptionLetterSpace.value + 'px',
    }
    return style
  }

  setBannerStyle() {
    let style = {
      'width': this.ms.featuredBannerWidth.value + 'vw',
      'background-color': this.ms.featuredBannerColor.value
    }
    return style
  }
}

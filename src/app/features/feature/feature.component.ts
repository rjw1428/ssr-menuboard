import { Component, OnInit, Input, Output, EventEmitter, AfterViewInit, OnChanges, HostListener, HostBinding } from '@angular/core';
import { FeaturedItem } from '@shared/interfaces/featured-item';
import { FeaturesService } from '@shared/services/features.service';
import { ManagementService } from '@shared/services/management.service';
import { environment } from 'environments/environment'
declare var $: any;



@Component({
  selector: 'app-feature',
  templateUrl: './feature.component.html',
  styleUrls: ['./feature.component.css']
})
export class FeatureComponent implements OnInit {
  @Input() feature: FeaturedItem
  @Input() editable = false;
  @Output() addFeature = new EventEmitter<{ feature: FeaturedItem }>()
  @Output() addChild = new EventEmitter<{ feature: FeaturedItem }>()
  @Output() remove = new EventEmitter<{ feature: FeaturedItem }>()
  @Output() shiftUp = new EventEmitter<{ feature: FeaturedItem }>()
  @Output() shiftDown = new EventEmitter<{ feature: FeaturedItem }>()
  @HostListener('window:resize', ['$event'])
  onResize(event?) {
    this.screenWidth = window.innerWidth;
  }
  screenWidth: number
  shared: FeaturedItem[] = []
  expand: boolean = false;
  logoUrl: string;
  menuToggle=false;
  constructor(public featureService: FeaturesService, public ms: ManagementService) {
    this.onResize();
    this.logoUrl = environment.barLogo
  }

  ngOnInit() {
    // $(document).ready(function () {
    //   $("img").error(function () {
    //     console.log("ERROR - " + this.feature.name)
    //   });
    // })

    if (!this.feature.child && !this.editable)
      this.featureService.parentDisplayedCount++
  }

  onInsert() {
    this.addFeature.emit({ feature: this.feature })
  }

  onAddChild() {
    this.addChild.emit({ feature: this.feature })
  }

  onEdit() {
    this.featureService.selectedFeature = Object.assign({}, this.feature)
    this.featureService.editMode = true
  }

  onDelete() {
    if (confirm("Are you sure you want to delete this Featured Item?") == true)
      this.remove.emit({ feature: this.feature })
  }

  onShiftUp() {
    this.shiftUp.emit({ feature: this.feature })
  }

  onShiftDown() {
    this.shiftDown.emit({ feature: this.feature })
  }

  toggleExpand() {
    this.expand == true ? this.expand = false : this.expand = true;
  }

  loadError() {
    console.log("THERE WAS AN ERROR:" + this.feature.key)
    this.featureService.setActive(this.feature.key, false)
  }

  toggleMenu() {
    this.menuToggle == true ? this.menuToggle = false : this.menuToggle = true;
  }
  setHeaderStyle() {
    let style = {
      'top': this.ms.featuredHeaderTop.value,
      'font-size': this.screenWidth <= 750 ? +this.ms.featuredHeaderSize.value / 2 + 'px' : this.ms.featuredHeaderSize.value + 'px',
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
      'font-size': this.screenWidth <= 750 ? +this.ms.featuredCaptionSize.value / 2 + 'px' : this.ms.featuredCaptionSize.value + 'px',
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
      'font-size': this.screenWidth <= 750 ? +this.ms.featuredDescriptionSize.value / 2 + 'px' : this.ms.featuredDescriptionSize.value + 'px',
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

  setImageStyle() {
    let style = {
      'width': (100 - +this.ms.featuredBannerWidth.value) + 'vw',
      'height': '100%'
    }
    return style
  }
}

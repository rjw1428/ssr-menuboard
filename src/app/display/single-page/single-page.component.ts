import { Component, OnInit, ElementRef, } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { FeaturesService } from '@shared/services/features.service';
import { NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap';
import { environment } from '@environments/environment';
import { FeaturedItem } from '@shared/interfaces/featured-item';
declare var $: any;

@Component({
  selector: 'app-single-page',
  templateUrl: './single-page.component.html',
  styleUrls: ['./single-page.component.scss'],
  providers: [NgbCarouselConfig],
  animations: []
})
export class SinglePageComponent implements OnInit {
  delay: number = 10
  numFeatureSlides: number = 2
  activeSlide = 0;
  logoUrl: string
  //slides = ["app-items-display-page2", "app-feature2", "app-specials-page"]
  featuredList: FeaturedItem[] = []
  activeFeature: number[] = Array.from(new Array(this.numFeatureSlides), (val, index) => index)
  constructor(public storage: AngularFireStorage, public featureService: FeaturesService, config: NgbCarouselConfig) {
    config.interval = 1000 * this.delay;
    config.showNavigationArrows = false;
    config.showNavigationIndicators = true;
    config.wrap = true;
    config.keyboard = true;
    config.pauseOnHover = false;
    //console.log(this.activeFeature)
  }

  ngOnInit() {
    //this.getImages()
    // this.featureService.getFeaturedList(environment.featureRootAddress).snapshotChanges().forEach(featuredItems => {
    //   this.featuredList = []
    //   featuredItems.forEach(element => {
    //     var y = element.payload.toJSON() as FeaturedItem;
    //     y['key'] = element.key
    //     // if (this.setActiveByDate(y) && y.active) {
    //     if (y.active) {
    //       this.featuredList.push(y)
    //     }
    //   })
    //   // this.featureService.parentDisplayedCount = 0
    //   this.featuredList.sort((el1, el2) => el1.order - el2.order)
    // })
  }

  onSlide(slideData: { current: string; }) {
    let current_raw = slideData.current
    let x = current_raw.split('-')
    this.activeSlide = +x[2]
    if (this.activeSlide == 0) {
      this.getNextFeature()
    }
  }

  getNextFeature() {
    this.activeFeature.forEach((num, index) => {
      let next = num + 2
      if (next >= this.featuredList.length)
        this.setToDefault(index)
      else
        this.setNext(index)
    });
    //console.log(this.activeFeature)
  }

  setToDefault(index: number) {
    this.activeFeature[index] = index;
  }

  setNext(index) {
    this.activeFeature[index] = this.activeFeature[index] + 2
  }

  getImages() {
    this.storage.ref('logo.png').getDownloadURL().toPromise()
      .then(value => {
        this.logoUrl = value;
      })
      .catch(e => console.log(e))
  }

  //this.getImages()
  // $(".carousel").carousel({
  //   interval: 1000 * this.delay,
  //   pause: false,
  //   wrap: true,
  //   keyboard: true
  // });

  //this.elRef.nativeElement.querySelector('.active')
  // $(".carousel").on('slid.bs.carousel', () => {
  //   console.log($('.carousel .active').index('.carousel .carousel-item'))
  //   // this.activeSlide = $(this).find('.active').index()
  //   // if (this.activeSlide == 0) {
  //   //   console.log("NEXT")
  //   // }
  //   //let x = $(this).find('.active').index()
  //   this.activeSlide = (this.activeSlide + 1) % this.numOfSlides;
  //})

  // setInterval(() => {
  //   // console.log(this.iterate)
  //   if (this.activeSlide == this.numOfSlides - 1)
  //     this.iterate = true;

  //   if (this.activeSlide == 0 && this.iterate) {
  //     this.iterate = false;
  //     console.log("NEXT")
  //     this.featureService.activeFeatureNum++;
  //   }
  // }, 1000)
}

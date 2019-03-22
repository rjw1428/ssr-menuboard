import { Component, OnInit, ElementRef, ViewChild, Input, } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { FeaturesService } from '@shared/services/features.service';
import { NgbCarouselConfig, NgbCarousel } from '@ng-bootstrap/ng-bootstrap';
import { environment } from '@environments/environment';
import { FeaturedItem } from '@shared/interfaces/featured-item';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { validateConfig } from '@angular/router/src/config';
import { map } from 'rxjs/operators';
import { filter } from 'rxjs-compat/operator/filter';
import { AngularFirestore } from '@angular/fire/firestore';
import { trigger, transition, style, animate } from '@angular/animations';
declare var $: any;

@Component({
  selector: 'app-single-page',
  templateUrl: './single-page.component.html',
  styleUrls: ['./single-page.component.scss'],
  providers: [NgbCarouselConfig],
})
export class SinglePageComponent implements OnInit {
  @Input('vertical') vertical: boolean = false
  delay: number = 15
  numFeatureSlides: number = 2
  activeSlide = 0;
  logoUrl: string
  featuredList: FeaturedItem[] = []
  //featuredList: Observable<FeaturedItem[]>
  @ViewChild('carousel') carousel: NgbCarousel;
  pause: boolean = false;

  activeFeature: number[] = Array.from(new Array(this.numFeatureSlides), (val, index) => index)
  client: string;
  constructor(public storage: AngularFireStorage,
    private route: ActivatedRoute,
    public featureService: FeaturesService,
    private afs: AngularFirestore) {
  }

  ngOnInit() {
    this.carousel.interval = 1000 * this.delay;
    this.carousel.wrap = true;
    this.carousel.pauseOnHover = false;
    this.carousel.keyboard = true;
    this.carousel.showNavigationArrows = false;
    this.carousel.showNavigationIndicators = true;
    // $('.carousel').carousel({
    //   interval: 1000 * this.delay,
    //   keyboard: true,
    //   pause: false,
    //   wrap: true
    // })
    // var self = this;
    // $('.carousel').on('slid.bs.carousel', function () {
    //   var currentIndex = $('div.active').index() - 1
    //   if (currentIndex == 0) {
    //     console.log("TRIGGER")
    //     this.activeFeature=self.getNextFeature()
    //     console.log(this.activeFeature)
    //   }
    // })
    this.route.params.switchMap(bar => {
      return this.featureService.getFeatureList(bar['client'])
        .snapshotChanges().pipe(
          map(val => {
            let x = val.payload.data()
            return x.featuresList
          }),
          map((features: FeaturedItem[]) => {
            return features.filter((feature: FeaturedItem) => feature.active)
          })
        )
    }).subscribe(vals => {
      this.featuredList = vals
      console.log("LEN: "+this.featuredList.length)
    })

    this.route.params
      .switchMap(val => {
        let client = val['client'] as string
        return this.afs.collection('clients').doc(client).snapshotChanges().map(vals => {
          let obj = vals.payload.data() as { backgroundLogo: string }
          return obj.backgroundLogo
        })
      }).subscribe(val => {
        this.logoUrl = val
      })

    this.route.params.subscribe(val => {
      this.client = val['client'] as string
    })
  }

  onSlide(slideData: { current: string; }) {
    //console.log("TRIGGER")
    let current_raw = slideData.current
    let x = current_raw.split('-')
    this.activeSlide = +x[this.numFeatureSlides]
    if (this.activeSlide == 0) {
      this.getNextFeature()
    }
  }

  getNextFeature() {
    let newFeatureOrder = []
    this.activeFeature.forEach(slide => {
      let next = slide + this.numFeatureSlides
      // if (next >= length)
      //   next = next - length
      // newFeatureOrder.push(next)
      if (next >= this.featuredList.length)
        next = next - this.featuredList.length
      newFeatureOrder.push(next)
    })
    this.activeFeature = newFeatureOrder
    return newFeatureOrder
  }

  getBackgroundLogo() {
    this.storage.ref('logo.png').getDownloadURL().toPromise()
      .then(value => {
        this.logoUrl = value;
      })
      .catch(e => console.log(e))
  }

  onClick() {
    if (this.pause) {
      console.log("PLAY")
      this.carousel.cycle();
      this.pause = false
    } else {
      console.log("PAUSE")
      this.carousel.pause();
      this.pause = true
    }
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

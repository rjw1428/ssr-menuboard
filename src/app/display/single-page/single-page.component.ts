import { Component, OnInit, ElementRef, ViewChild, Input, OnChanges, } from '@angular/core';
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
import { ProtractorBrowser } from 'protractor';
declare var $: any;

@Component({
  selector: 'app-single-page',
  templateUrl: './single-page.component.html',
  styleUrls: ['./single-page.component.scss'],
  providers: [NgbCarouselConfig],
})
export class SinglePageComponent implements OnInit, OnChanges {
  @Input('vertical') vertical: boolean = false
  delay: number = 10
  numFeatureSlides: number = 2;
  numBeerSlides: number = 2;
  activeSlide = 0;
  logoUrl: string
  featuredList: FeaturedItem[] = []
  prevLength: number = 0
  count: number = 0
  //featuredList: Observable<FeaturedItem[]>
  @ViewChild('carousel') carousel: NgbCarousel;
  @Input() pause: boolean = false;
  activeFeature: number[] = []
  client: string;
  screenNum: string;
  background = {
    //Default
    'background-color': "rgb(0,0,0)",
    'background-image': '',
    'animation': '',
    'top': '',
    'left': '',
  }

  border = {
    'border': '',
    'border-radius': '10px',
    'background-color': 'rgba(0,0,0, .5)',
    'box-shadow': '10px 10px 10px black',
    'margin-top': '2vh',
    'margin-bottom': '2vh',
    'margin-left': '2vh',
    'margin-right': '2vh',
    'height': '96vh',
    'width': '96vw'
  }

  logo = {
    'height': '50vw',
    'width': '50vw',
    'opacity': '.5'
  }
  constructor(public storage: AngularFireStorage,
    private route: ActivatedRoute,
    public featureService: FeaturesService,
    private afs: AngularFirestore) {
  }

  ngOnInit() {

    this.route.params.switchMap(bar => {
      this.client = bar['client'] as string
      this.screenNum = bar['screen'] as string
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
      //this.getNextFeature()
      // console.log("LEN: " + this.featuredList.length)
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

    // GET BACKEND PROPERTIES
    this.route.params.switchMap(val => {
      let client = val['client'] as string
      return this.afs.collection('clients').doc(client).collection('properties').snapshotChanges().map(vals => {
        return vals.map(val => {
          let obj = val.payload.doc.data()
          obj['id'] = val.payload.doc.id
          return obj
        })
      })
    }).subscribe((props) => {
      props.forEach((prop:
        {
          id: string, size: string, color: string, radius: string, image: string, image2: string, value: string, marginVert: string,
          marginHorz: string, animation: string, top: string, left: string, backgroundColor: string, shadow: string, 
          backgroundSize: string, opacity: string
        }) => {
        if (prop.id == "border") {
          this.border['border'] = prop.size + " solid " + prop.color
          this.border['border-radius'] = prop.radius
          this.border['margin-bottom'] = prop.marginVert
          this.border['margin-top'] = prop.marginVert
          this.border['margin-left'] = prop.marginHorz
          this.border['margin-right'] = prop.marginHorz
          this.border['background-color'] = prop.backgroundColor
          this.border['box-shadow'] = prop.shadow
          this.border['height'] = `calc(100vh - 2 * ${prop.marginVert})`
          this.border['width'] = `calc(100vw - 2 * ${prop.marginHorz})`
        }
        if (prop.id == "background") {
          this.background['background-color'] = prop.color
          if (this.screenNum == '1')
            this.background['background-image'] = prop.image
          else this.background['background-image'] = prop.image2
          this.background['animation'] = prop.animation
          this.background['top'] = prop.top
          this.background['left'] = prop.left
          this.background['background-size'] = prop.backgroundSize
        }
        if (prop.id == "delay") {
          this.delay = +prop.value
          this.carousel.interval = 1000 * this.delay;
        }
        if (prop.id == "features") {
          this.numFeatureSlides = +prop.value
          this.activeFeature = Array.from(new Array(this.numFeatureSlides), (val, index) => index)
        }
        if (prop.id == "logo") {
          this.logo['width'] = prop.size
          this.logo['height'] = prop.size
          this.logo['opacity']= prop.opacity
        }
      })
    })
    this.carousel.wrap = true;
    this.carousel.pauseOnHover = false;
    this.carousel.keyboard = true;
    this.carousel.showNavigationArrows = false;
    this.carousel.showNavigationIndicators = true;
  }

  ngOnChanges() {
    this.onPause();
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
    let newFeatureOrder = []
    this.activeFeature.forEach((slide, index) => {
      newFeatureOrder.push((this.numFeatureSlides * this.count + index) % this.featuredList.length)
    })
    // console.log(newFeatureOrder)
    // console.log(this.count)
    this.count = (this.count + 1) % this.featuredList.length
    this.activeFeature = newFeatureOrder
  }

  getBackgroundLogo() {
    this.storage.ref('logo.png').getDownloadURL().toPromise()
      .then(value => {
        console.log("GETTING BG LOGO")
        return value
      })
      .then(value => {
        this.logoUrl = value;
      })
      .catch(e => console.log(e))
  }

  onClick() {
    if (this.pause) {
      this.pause = false
    } else {
      this.pause = true
    }
    this.afs.collection('clients').doc(this.client).collection('screens').doc(this.screenNum).update({
      pause: this.pause
    })
    this.onPause()
  }

  onPause() {
    if (!this.pause) {
      this.carousel.cycle();
    } else {
      this.carousel.pause();
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

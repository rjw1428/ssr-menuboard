import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { FeaturesService } from '@shared/services/features.service';
import { FeaturedItem } from '@shared/interfaces/featured-item';
import { environment } from '@environments/environment';
import { trigger, transition, query, animate, style } from '@angular/animations';

@Component({
  selector: 'app-feature-page',
  templateUrl: './feature-page.component.html',
  styleUrls: ['./feature-page.component.css'],
  animations: [
    trigger('fade', [
      transition('* => *', [
        query(':enter', style({  opacity: 0 }), { optional: true }),
        query(':enter', animate('500ms ease-in', style({ opacity: 1 })), { optional: true }),
        query(':leave', style({ opacity: 1, }), { optional: true }),
        query(':leave', animate('400ms ease-out', style({ opacity: 0, })), { optional: true })
      ]),
    ]),
  ]
})
export class FeaturePageComponent implements OnInit {
  @Input() delay: number;
  @Input() numberOfConsecutiveFeatures: number;
  @Input() activePage: number;
  @Output() displayComplete = new EventEmitter<{}>()
  @Output() featureComplete = new EventEmitter<{}>()
  displayChild: boolean = false;
  featuredList: FeaturedItem[] = []
  children: FeaturedItem[] = []
  interval: any;
  done: boolean = false;
  display = true;
  active: boolean = true;
  constructor(public featureService: FeaturesService) {
  }

  ngOnInit() {
    console.log("FEATURES START")
    this.featureService.getFeaturedList(environment.featureRootAddress).snapshotChanges().forEach(featuredItems => {
      this.featuredList = []
      featuredItems.forEach(element => {
        var y = element.payload.toJSON() as FeaturedItem;
        y['key'] = element.key
        if (this.setActiveByDate(y) && y.active) {
          this.featuredList.push(y)
        }
      })
      // console.log(this.featuredList.length)
      // console.log("ACTIVE FEATURE NUM: " + this.featureService.activeFeatureNum)
      // console.log("CONSEC NUM: " + this.numberOfConsecutiveFeatures)
      // console.log("PARENT COUNT: " + this.featureService.parentDisplayedCount)
      this.featureService.parentDisplayedCount = 0
      this.featuredList.sort((el1, el2) => el1.order - el2.order)
    })

    //SET COMPLETION INTERVAL
    // console.log(this.featureService.activeFeatureNum)
    this.interval = setInterval(() => {
      // console.log(this.featureService.activeFeatureNum)
      if (this.featureService.parentDisplayedCount == this.numberOfConsecutiveFeatures) {
        if (!this.checkBelowItem().child) {
          this.featureService.parentDisplayedCount = 0
          this.displayComplete.emit();
        } else
          this.nextFeature()
      }
      else
        this.nextFeature()
    }, 1000 * this.delay)
  }


  setActiveByDate(feature: FeaturedItem): boolean {
    let isActive: boolean = true
    let dateStore = feature.startDate.split("/")
    let start = new Date(+dateStore[2], +dateStore[0] - 1, +dateStore[1], 4, 0, 0)
    dateStore = feature.endDate.split("/")
    let end = new Date(+dateStore[2], +dateStore[0] - 1, (+dateStore[1] + 1), 4, 0, 0)
    let today = new Date()
    if (feature.startDate != '') {
      if (today >= start)
        isActive = true
      else
        isActive = false
    }

    if (feature.endDate != '' && isActive)
      if (today >= end)
        isActive = false

    if (feature.endDate != '' || feature.startDate != '')
      if (feature.active != isActive)
        this.featureService.setActive(feature.key, isActive)

    if (isActive)
      return true
    else
      return false
  }

  nextFeature() {
    if (this.featureService.activeFeatureNum < this.featuredList.length - 1) {
      this.featureService.activeFeatureNum++
    } else this.featureService.activeFeatureNum = 0
    this.featureComplete.emit();
  }

  checkBelowItem(): FeaturedItem {
    if (this.featureService.activeFeatureNum < this.featuredList.length - 1)
      return this.featuredList[this.featureService.activeFeatureNum + 1]
    else return this.featuredList[0]
  }

  ngOnDestroy() {
    console.log("FEATURES COMPLETE")
    this.nextFeature()
    if (this.interval)
      clearInterval(this.interval)
  }
}

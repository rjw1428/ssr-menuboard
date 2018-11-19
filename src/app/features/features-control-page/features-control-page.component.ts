import { Component } from '@angular/core';
import { FeaturedItem } from '@shared/interfaces/featured-item';
import { FeaturesService } from '@shared/services/features.service';
import { environment } from '@environments/environment'

@Component({
  selector: 'app-features-control-page',
  templateUrl: './features-control-page.component.html',
  styleUrls: ['./features-control-page.component.css']
})
export class FeaturesControlPageComponent {
  featuredList: FeaturedItem[] = []
  features: FeaturedItem[] = []
  constructor(public featureService: FeaturesService) {
    this.featureService.getFeaturedList(environment.featureRootAddress).snapshotChanges().forEach(featuredItems => {
      this.featuredList = []
      featuredItems.forEach(element => {
        var y = element.payload.toJSON();
        y['key'] = element.key
        this.featuredList.push(y as FeaturedItem)
      })
      this.featuredList.sort((el1, el2) => el1.order - el2.order)
    })
  }
  //WHEN SCREEN IS BLANK, ADD FEATURE BUTTON ACTION
  addFeature() {
    this.featureService.selectedFeature = {
      key: null,
      order: 1,
      header: '',
      caption: '',
      subcaption: '',
      url: '',
      active: false,
      startDate: '',
      endDate: '',
      child: false,
      lastModified: '',
      layout: 'right',
    }
    this.featureService.editMode = true
  }

  insertParent(obj: { feature: FeaturedItem }) {
    this.featureService.selectedFeature = {
      key: null,
      order: obj.feature.order + 1,
      header: '',
      caption: '',
      subcaption: '',
      url: '',
      active: true,
      startDate: '',
      endDate: '',
      child: false,
      lastModified: '',
      layout: 'right',
    }
    this.featureService.editMode = true
  }

  insertChild(obj: { feature: FeaturedItem }) {
    this.featureService.selectedFeature = {
      key: null,
      order: obj.feature.order + 1,
      header: '',
      caption: '',
      subcaption: '',
      url: '',
      active: true,
      startDate: '',
      endDate: '',
      child: true,
      lastModified: '',
      layout: 'right'
    }
    this.featureService.editMode = true
  }

  onRemove(obj: { feature: FeaturedItem }) {
    this.featureService.featureList = this.featuredList
    this.featureService.removeFeatured(obj.feature)
  }

  onShiftUp(obj: { feature: FeaturedItem }) {
    this.featureService.featureList = this.featuredList
    this.featureService.shiftUp(obj.feature)
  }

  onShiftDown(obj: { feature: FeaturedItem }) {
    this.featureService.featureList = this.featuredList
    this.featureService.shiftDown(obj.feature)
  }

  onClose() {
    this.featureService.editMode = false
  }

  onInsertComplete(obj: any) {
    this.featureService.featureList = this.featuredList
    this.featureService.insertFeatured(obj.featured)
    this.onClose()
  }
}

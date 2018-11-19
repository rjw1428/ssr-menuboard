import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { FeaturedItem } from '@shared/interfaces/featured-item';
import { environment } from '@environments/environment'

@Injectable()
export class FeaturesService {
  selectedFeature: FeaturedItem;
  editMode: boolean = false;
  featureList: FeaturedItem[] = []

  isParentFlag: boolean = false;
  activeFeatureNum: number = 0
  parentDisplayedCount: number = 0
  constructor(private firebaseData: AngularFireDatabase) { }

  getFeaturedList(address: string) {
    return this.firebaseData.list(address, ref => ref.orderByChild('order'))
  }

  insertFeatured(featured: FeaturedItem) {
    this.featureList.forEach((element: FeaturedItem) => {
      if (element.order >= featured.order) {
        this.firebaseData.list(environment.featureRootAddress).update(element.key, {
          order: element.order + 1
        })
      }
    })

    this.firebaseData.list(environment.featureRootAddress).push({
      order: featured.order,
      header: featured.header,
      caption: featured.caption,
      subcaption: featured.subcaption,
      url: featured.url,
      startDate: featured.startDate,
      endDate: featured.endDate,
      active: featured.active,
      child: featured.child,
      layout: featured.layout,
      lastModified: this.timestamp()
    })
  }


  updateFeatured(featured: FeaturedItem) {
    this.firebaseData.list(environment.featureRootAddress).update(featured.key, {
      order: featured.order,
      header: featured.header,
      caption: featured.caption,
      subcaption: featured.subcaption,
      url: featured.url,
      startDate: featured.startDate,
      endDate: featured.endDate,
      active: featured.active,
      child: featured.child,
      layout: featured.layout,
      lastModified: this.timestamp()
    })
  }

  removeFeatured(featured: FeaturedItem) {
    this.featureList.forEach((element: FeaturedItem) => {
      if (element.order > featured.order) {
        this.firebaseData.list(environment.featureRootAddress).update(element.key, {
          order: element.order - 1
        })
      }
    })

    this.firebaseData.list(environment.featureRootAddress).remove(featured.key)
  }

  shiftUp(featured: FeaturedItem) {
    if (featured.order > 1) {
      let current_index = featured.order - 1
      let nextItem = this.featureList[current_index - 1] as FeaturedItem
      this.firebaseData.list(environment.featureRootAddress).update(nextItem.key, {
        order: nextItem.order + 1,
        // child: featured.child
      })
      this.firebaseData.list(environment.featureRootAddress).update(featured.key, {
        order: featured.order - 1,
        // child: nextItem.child
      })
    }
  }

  shiftDown(featured: FeaturedItem) {
    if (featured.order < this.featureList.length) {
      let current_index = featured.order - 1
      let nextItem = this.featureList[current_index + 1] as FeaturedItem
      this.firebaseData.list(environment.featureRootAddress).update(featured.key, {
        order: featured.order + 1,
        // child: nextItem.child
      })
      this.firebaseData.list(environment.featureRootAddress).update(nextItem.key, {
        order: nextItem.order - 1,
        // child: featured.child
      })
    }
  }

  setActive(key: string, val: boolean) {
    this.firebaseData.list(environment.featureRootAddress).update(key, {
      active: val,
      lastModified: this.timestamp()
    })
  }

  timestamp() {
    return new Date().toLocaleString('en-US', { timeZone: 'America/New_York' })
  }
}

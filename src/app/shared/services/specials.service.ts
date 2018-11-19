import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { Specials } from '@shared/interfaces/specials';

@Injectable()
export class SpecialsService {
  editMode = false
  specialSelected: Specials = new Specials()
  specialsList: Specials[] = []
  constructor(private firebaseData: AngularFireDatabase) { }

  getSpecials() {
    return this.firebaseData.list('specialsList', ref => ref.orderByChild('order'))
  }

  insert(special: Specials) {
    this.specialsList.forEach(spec => {
      if (spec.order >= special.order) {
        this.firebaseData.list('specialsList').update(spec.key, {
          order: spec.order + 1
        })
      }
    })
    this.firebaseData.list('specialsList').push({
      title: special.title,
      order: special.order,
      note: special.note,
      lastModified: this.timestamp()
    })
  }


  edit(special: Specials) {
    this.firebaseData.list('specialsList').update(special.key, {
      title: special.title,
      order: special.order,
      note: special.note,
      lastModified: this.timestamp()
    }) 
  }

  remove(special: Specials) {
    this.specialsList.forEach(spec => {
      if (spec.order > special.order) {
        this.firebaseData.list('specialsList').update(spec.key, {
          order: spec.order - 1
        })
      }
    })
    this.firebaseData.list('specialsList').remove(special.key)
  }

  shiftUp(special: Specials) {
    if (special.order > 1) {
      let currentIndex = special.order - 1
      let neighbor = this.specialsList[currentIndex - 1] as Specials
      this.firebaseData.list('specialsList/').update(special.key, {
        order: special.order - 1,
      })
      this.firebaseData.list('specialsList/').update(neighbor.key, {
        order: neighbor.order + 1,
      })
    }
  }

  shiftDown(special: Specials) {
    if (special.order < this.specialsList.length) {
      let currentIndex = special.order - 1
      let neighbor = this.specialsList[currentIndex + 1] as Specials
      this.firebaseData.list('specialsList/').update(special.key, {
        order: special.order + 1,
      })
      this.firebaseData.list('specialsList/').update(neighbor.key, {
        order: neighbor.order - 1,
      })
    }
  }

  timestamp() {
    return new Date().toLocaleString('en-US', { timeZone: 'America/New_York' })
  }
}

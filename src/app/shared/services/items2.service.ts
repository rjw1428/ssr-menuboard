import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, DocumentChangeAction } from '@angular/fire/firestore'
import { Beer } from '@shared/interfaces/beer';
import { AngularFireDatabase, AngularFireList, AngularFireObject } from '@angular/fire/database/database';
import { Brewery } from '@shared/interfaces/brewery';
import { Observable } from 'rxjs';

@Injectable()
export class Items2Service {
  beerCollection: AngularFirestoreCollection<Beer>
  selectedBeer: Beer = null
  constructor(
    private afs: AngularFirestore,
    // private firebaseData: AngularFireDatabase
  ) { }

  getData(start, end) {
    return this.afs.collection('masterBeerList', ref => {
      return ref.orderBy('name').startAt(start).endAt(end)
    }).snapshotChanges()
  }

  getData2() {
    return this.afs.collection('masterBeerList').snapshotChanges()
  }
  // getData(): AngularFireList<Beer> {
  //   return this.firebaseData.list('masterBeerList', ref => ref.orderByChild('name'))
  // }

  // getBrewery(key: string): AngularFireList<Brewery> {
  //   return this.firebaseData.list('masterBreweryList/' + key)
  // }
}

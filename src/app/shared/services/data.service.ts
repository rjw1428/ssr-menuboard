import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, DocumentChangeAction, AngularFirestoreDocument } from '@angular/fire/firestore'
import { Beer } from '@shared/interfaces/beer';
import { Brewery } from '@shared/interfaces/brewery';
import { Observable, defer, combineLatest } from 'rxjs';
import { Localbeer } from '@shared/interfaces/localbeer';
import { tap, shareReplay, map, switchMap, zip } from 'rxjs/operators';
import { environment } from '@environments/environment';
import { AngularFireStorage } from '@angular/fire/storage';
import { MatDialog, MatSnackBar } from '@angular/material';
import { AuthService } from './auth.service';
import { AngularFireDatabase } from '@angular/fire/database';
import { ActivatedRoute, Params } from '@angular/router';
import { FeaturedItem } from '@shared/interfaces/featured-item';


export const buildBeer = (
  afs: AngularFirestore
) => {
  return source =>
    defer(() => {
      let rawData: Observable<Localbeer[]>
      let beerAppendedData: Localbeer[]
      return source.pipe(
        switchMap((data: Observable<Localbeer[]>) => {
          rawData = data
          const beers = [];
          rawData.forEach(local => {
            beers.push(afs.doc('masterBeerList/' + local['beerID'])
              .snapshotChanges().map((rawBeer) => {
                let buildBeer=rawBeer.payload.data()
                buildBeer['id']=rawBeer.payload.id
                return buildBeer
              })
            );
          })
          return combineLatest(beers)
        }),
        map(joins => {
          return rawData.map((v, i) => {
            let obj = { ...rawData[i], ['beer']: joins[i] }
            return obj
          })
        }),
        switchMap((data: Localbeer[]) => {
          beerAppendedData = data;
          const brews = [];
          beerAppendedData.forEach((item, i) => {
            let brewID = item.beer.masterBreweryKey
            brews.push(afs.doc('masterBreweryList/' + brewID)
              .valueChanges()
            );
          })
          return combineLatest(brews)
        }),
        map((joins: Brewery) => {
          return beerAppendedData.map((val, i) => {
            let x = val.beer
            x['brewery'] = joins[i]
            return { ...val, ['beer']: x }
          })
        }),
      )
    })
}

export const docJoin = (
  afs: AngularFirestore,
  storage: AngularFireStorage,
  field: string, //beerID
  collection: string, //masterBeerList
  result: string //beer
) => {
  return source =>
    defer(() => {
      let collectionData: DocumentChangeAction<any>[]
      let beerList: Beer[] = []
      return source.pipe(
        switchMap((data: DocumentChangeAction<any>[]) => {

          //Save the parent data state
          collectionData = data;
          const reads$ = [];
          const imgs$ = [];
          const comb$ = [];
          collectionData.forEach(joinDoc => {
            let obj = joinDoc.payload.doc.data()
            reads$.push(afs.doc(`${collection}/${obj[field]}`)
              .valueChanges()
            );
            // if (obj.icon)
            // imgs$.push(storage.ref(environment.itemIconRootAddress + obj.icon).getDownloadURL())
            // else imgs$.push(Observable.of(100))
          })
          //console.log(imgs$)
          return combineLatest(reads$)
        }),
        //Takes result of switchmap and joins to parent
        map(joins => {
          // console.log(joins)
          return collectionData.map((v, i) => {
            let obj = { ...v.payload.doc.data(), [result]: joins[i], ['id']: v.payload.doc.id }
            return obj as Beer;
          })
        }),
        // switchMap((beers: Beer[]) => {
        //   //beerList = beers
        //   //console.log(beerList)
        //   const imgLocList = []
        //   beers.forEach(beer => {
        //     if (beer.icon)
        //       imgLocList.push(this.storage.ref(environment.itemIconRootAddress + beer.icon).getDownloadURL())
        //     else imgLocList.push(Observable.of(''))
        //   })
        //   return combineLatest(beers)
        // }),
        // map(imgs => {
        //   // console.log(beerList)
        //   // return beerList
        //   // console.log(imgs)
        //   // return imgs
        //   return beerList.map((beer, i) => {
        //     let obj = { ...beer, ['imgLoc']: imgs[i] } //
        //     console.log(obj)
        //     return obj
        //   })
        // })
      )
    })
}

@Injectable()
export class DataService {
  beerFirestoreList: AngularFirestoreCollection
  breweryFirestoreList: AngularFirestoreCollection
  localFirestoreList: AngularFirestoreDocument
  beerCollection: Observable<Beer[]>
  breweryCollection: Observable<Brewery[]>
  localCollection: Observable<Localbeer[]>
  propertiesFirestoreList: AngularFirestoreDocument
  selectedBeer: Beer = null
  selectedBrewery: Brewery = null
  selectedLocal: Localbeer;
  selectedIndex: number;
  FeaturedCollection: Observable<FeaturedItem[]>;
  constructor(private afs: AngularFirestore,
    private storage: AngularFireStorage) {

    this.beerFirestoreList = this.afs.collection('masterBeerList', ref => {
      return ref.where('active', '==', true).orderBy('name') //.limit(100)
    })
    this.beerCollection = this.beerFirestoreList.snapshotChanges().pipe(
      tap(reads => console.log("BEERS: " + reads.length)),
      docJoin(this.afs, this.storage, 'masterBreweryKey', 'masterBreweryList', 'brewery'),
      map((vals: Beer[]) => vals.sort((a, b) => {
        // let t1 = a.withBrewery ? a.brewery.name + " " + a.name : a.name
        // let t2 = b.withBrewery ? b.brewery.name + " " + b.name : b.name
        // if (t1 > t2) return 1
        // if (t1 < t2) return -1
        return 0
      })),
      map(beers => {
        return beers.map(beer => {
          let x = beer

          return x as Beer
        })
      }),
      shareReplay(1)
    )

    this.breweryFirestoreList = this.afs.collection('masterBreweryList', ref => {
      return ref.where('active', '==', true).limit(100)
    })
    this.breweryCollection = this.breweryFirestoreList.snapshotChanges().pipe(
      tap(reads => console.log("BREWS: " + reads.length)),
      shareReplay(1),
      map(vals => {
        return vals.map(val => {
          let x = val.payload.doc.data()
          x['id'] = val.payload.doc.id
          this.storage.ref(environment.itemIconRootAddress + x.icon).getDownloadURL().toPromise()
            .then(value => {
              x.iconLoc = value;
            })
            .catch(e => {
              x.iconLoc = '../../../assets/404icon.png'
            })
          return x as Brewery
        })
      })
    )
  }

  getLocalCollection(client: string) {
    this.localFirestoreList = this.afs.collection('clients').doc(client)
    if (this.localFirestoreList) {
      this.localCollection = this.localFirestoreList.snapshotChanges().pipe(
        map(val => {
          let x = val.payload.data() as { beerList: Localbeer[], featuresList: FeaturedItem[] }
          return x.beerList
        }),
        buildBeer(this.afs),
        map((vals: Localbeer[]) => {
          return vals
        }),
        shareReplay(1),
      )
      return this.localCollection
    } else
      return []
  }

  getBarProperties(client: string) {
    this.propertiesFirestoreList = this.afs.collection('clients').doc(client)
    return this.propertiesFirestoreList
  }

  getFeaturedCollection(client: string) {
    this.localFirestoreList = this.afs.collection('clients').doc(client)
    if (this.localFirestoreList) {
      this.FeaturedCollection = this.localFirestoreList.snapshotChanges().pipe(
        map(val => {
          let x = val.payload.data() as { beerList: Localbeer[], featuresList: FeaturedItem[] }
          return x.featuresList
        }),
        shareReplay(1),
      )
      return this.FeaturedCollection
    } else
      return []
  }

  logImageError(imageName: String) {
    this.afs.collection('error').add({
      icon: imageName,
      date: this.timestamp()
    })
  }

  timestamp() {
    return new Date().toLocaleString('en-US', { timeZone: 'America/New_York' })
  }
}
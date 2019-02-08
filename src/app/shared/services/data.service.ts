import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, DocumentChangeAction } from '@angular/fire/firestore'
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


export const buildBeer = (
  afs: AngularFirestore
) => {
  return source =>
    defer(() => {
      let rawData: DocumentChangeAction<Localbeer>[]
      let beerAppendedData: { bulk: DocumentChangeAction<Localbeer>, beerHold: Beer }[]
      let breweryAppendedData: { bulk: DocumentChangeAction<Localbeer>, beerHold: Beer, breweryHold: Brewery }[]
      return source.pipe(
        switchMap((data: DocumentChangeAction<Localbeer>[]) => {

          //Save the parent data state
          rawData = data;
          const beers = [];

          rawData.forEach(localBeer => {
            let obj = localBeer.payload.doc.data() as Localbeer
            beers.push(afs.doc('masterBeerList/' + obj['beerID'])
              .valueChanges()
            );
          })
          return combineLatest(beers)
        }),
        map(joins => {
          return rawData.map((v, i) => {
            let obj = { ['bulk']: rawData[i], ['beerHold']: joins[i] }
            return obj
          })
        }),
        switchMap((data: { bulk: DocumentChangeAction<Localbeer>, beerHold: Beer }[]) => {
          //Save the parent data state
          beerAppendedData = data;
          const brews = [];

          beerAppendedData.forEach(bulkData => {
            let brewID = bulkData.beerHold.masterBreweryKey
            brews.push(afs.doc('masterBreweryList/' + brewID)
              .valueChanges()
            );
          })
          return combineLatest(brews)
        }),
        //Takes result of switchmap and joins to parent
        map(joins => {
          return beerAppendedData.map((v, i) => {
            return { ['bulk']: beerAppendedData[i].bulk, ['beerHold']: beerAppendedData[i].beerHold, ['breweryHold']: joins[i] }
          })
        }),
        map((vals: { bulk: DocumentChangeAction<Localbeer>, beerHold: Beer, breweryHold: Brewery }[]) => {
          return vals.map((val) => {
            let constructedBeer = val.beerHold as Beer
            constructedBeer['brewery'] = val.breweryHold as Brewery

            let obj = val.bulk.payload.doc.data()
            obj['id'] = val.bulk.payload.doc.id
            obj['beer'] = constructedBeer
            return obj as Localbeer
          })
        })
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
  localFirestoreList: AngularFirestoreCollection
  beerCollection: Observable<Beer[]>
  breweryCollection: Observable<Brewery[]>
  localCollection: Observable<Localbeer[]>
  selectedBeer: Beer = null
  selectedBrewery: Brewery = null
  selectedLocal: Localbeer;
  constructor(private afs: AngularFirestore,
    private storage: AngularFireStorage) {

    this.beerFirestoreList = this.afs.collection('masterBeerList', ref => {
      return ref.where('active', '==', true).limit(100).orderBy('name')
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
    this.localFirestoreList = this.afs.collection('clients').doc(client).collection('beerList', ref => {
      return ref.limit(100)
    })
    this.localCollection = this.localFirestoreList.snapshotChanges().pipe(
      tap(reads => console.log("LOCAL: " + reads.length)),
      buildBeer(this.afs),
      map((vals: Localbeer[]) => {
        return vals
      }),
      shareReplay(1),
    )
    return this.localCollection
  }

  timestamp() {
    return new Date().toLocaleString('en-US', { timeZone: 'America/New_York' })
  }
}
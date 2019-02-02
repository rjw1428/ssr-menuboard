import { Component, OnInit, Inject } from '@angular/core';
import { Items2Service } from '@shared/services/items2.service';
import { Observable, Subject, Subscription, of, BehaviorSubject } from 'rxjs';
import { Beer } from '@shared/interfaces/beer';
import { AngularFirestoreCollection, AngularFirestore, AngularFirestoreDocument, DocumentChangeAction } from '@angular/fire/firestore';
import { Brewery } from '@shared/interfaces/brewery';
import { Item } from '@shared/interfaces/item';
import { environment } from '@environments/environment';
import { AngularFireStorage } from '@angular/fire/storage';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import { combineLatest, defer } from 'rxjs'
import { map, switchMap, startWith } from 'rxjs/operators';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { DialogAddBeerDialog } from '../beer-form/form.component';
import { transformAll } from '@angular/compiler/src/render3/r3_ast';
import { IconNamePipe } from '@shared/pipes/icon-name.pipe';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import * as _ from "lodash";
import { TitlecasePipe } from '@shared/pipes/titlecase.pipe';
import { DialogAddBreweryDialog } from '../brewery-form/form.component';


export const docJoin = (
  afs: AngularFirestore,
  field: string, //masterBreweryKey
  collection: string, //masterBreweryList
) => {
  return source =>
    defer(() => {
      let collectionData: DocumentChangeAction<Brewery>[]

      return source.pipe(
        switchMap((data: DocumentChangeAction<Brewery>[]) => {

          //Save the parent data state
          collectionData = data;
          const reads$ = [];

          collectionData.forEach(brewery => {
            let obj = brewery.payload.doc.data()
            reads$.push(afs.doc(`${collection}/${obj[field]}`).valueChanges());
          })
          return combineLatest(reads$)
        }),
        //Takes result of switchmap and joins to parent
        map(joins => {
          return collectionData.map((v, i) => {
            return { ...v.payload.doc.data(), ['brewery']: joins[i], ['id']: v.payload.doc.id };
          })
        })
      )
    })
}

@Component({
  selector: 'app-beer-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})

export class SearchComponent implements OnInit {
  beerCollection: AngularFirestoreCollection<Beer>
  breweryCollection: AngularFirestoreCollection<Brewery>
  beerList: Beer[] = []
  filteredBeerList: Beer[] = []
  breweryList: Brewery[] = []
  filteredBreweries: Observable<Brewery[]>
  typeList: string[] = []
  filteredTypes: Observable<string[]>
  filters = {}
  searchForm: FormGroup
  selectedBeer: Beer
  constructor(private afs: AngularFirestore,
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
    private fb: FormBuilder,
    private storage: AngularFireStorage) { }

  ngOnInit() {
    this.buildForm()
    this.beerCollection = this.afs.collection('masterBeerList', ref => {
      return ref.limit(100).orderBy('name')
    })
    this.breweryCollection = this.afs.collection('masterBreweryList', ref => {
      return ref.limit(100).orderBy('name')
    })

    //GET BEER LIST
    this.beerCollection.snapshotChanges()
      .pipe(docJoin(this.afs, 'masterBreweryKey', 'masterBreweryList'))
      .subscribe((beers: Beer[]) => {
        this.beerList = []
        beers.forEach((val: Beer) => {
          let temp = val
          temp['type'] = new TitlecasePipe().transform(val.type)
          this.beerList.push(temp)
          this.typeList.push(val.type.toLowerCase())
        })
        this.typeList = this.typeList.filter((val, index, self) => self.indexOf(val) === index).sort((a, b) => {
          if (a > b) return 1
          if (a < b) return -1
          return 0
        })
        this.filteredTypes = this.searchForm.get('type').valueChanges
          .pipe(startWith(''),
            map(value => {
              return this.typeList.filter(type => type.includes(value.toLowerCase()))
            })
          )
        this.applyFilters()
      })


    //GET BREWERY LIST
    this.afs.collection('masterBreweryList')
      .snapshotChanges()
      .map(vals => {
        return vals
          .map(val => {
            let brewery = val.payload.doc.data() as Brewery
            brewery['masterBreweryKey'] = val.payload.doc.id
            return brewery
          })
      })
      .subscribe((breweries) => {
        this.breweryList = []
        breweries.forEach(el => {
          this.storage.ref(environment.itemIconRootAddress + el.icon).getDownloadURL().toPromise()
            .then(value => {
              el.icon = value;
            })
            .catch(e => {
              el.icon = '../../../assets/404icon.png'
            })
          this.breweryList.push(el)
        })
        this.breweryList.sort((a, b) => {
          if (a.name > b.name) return 1
          if (a.name < b.name) return -1
          return 0
        })
        this.filteredBreweries = this.searchForm.get('keyword').valueChanges
          .pipe(startWith<string | Brewery>(''),
            map((value: any) => typeof value === 'object' ? value.name : value),
            map((brew: string) => brew ? this._instafilter(brew) : this.breweryList.slice())
          )
      })
  }

  private _instafilter(value: string): Brewery[] {
    if (!value)
      return [];
    return this.breweryList.filter((brew: Brewery) => brew.name.toLowerCase().indexOf(value.toLowerCase()) === 0)
  }

  buildForm() {
    this.searchForm = this.fb.group({
      keyword: '',
      type: ''
    })
  }

  resetKeyword() {
    this.searchForm.setValue({
      'keyword': '',
      'type': this.searchForm.get('type').value
    })
    this.removeFilter('masterBreweryKey')
  }

  resetType() {
    this.searchForm.setValue({
      'keyword': this.searchForm.get('keyword').value,
      'type': ''
    })
    this.removeFilter('type')
  }

  applyFilters() {
    this.filteredBeerList = _.filter(this.beerList, _.conforms(this.filters)).sort((a, b) => {
      let t1=a.withBrewery?a.brewery.name+" "+a.name:a.name
      let t2=b.withBrewery?b.brewery.name+" "+b.name:b.name
      if (t1 > t2) return 1
      if (t1 < t2) return -1
      return 0
    })
  }

  filterBrewery() {
    let b = this.searchForm.get('keyword').value as Brewery
    this.filters['masterBreweryKey'] = val => val == b.masterBreweryKey
    this.applyFilters()
  }

  filterType() {
    let t = this.searchForm.get('type').value
    this.filters['type'] = val => val.toLowerCase() == t
    this.applyFilters()
  }

  removeFilter(property: string) {
    delete this.filters[property]
    this[property] = null
    this.applyFilters()
  }

  displayName(brewery: Brewery) {
    return brewery.name
  }

  displayType(t: string) {
    let x = new TitlecasePipe().transform(t)
    return x
  }

  isSelectedValue(b: any) {
    return b.value.masterBreweryKey ? true : false
  }

  parseSelectionForIcon(b: any) {
    return b.value.icon
  }

  openBeerDialog(): void {
    const dialogRef = this.dialog.open(DialogAddBeerDialog, {
      width: '500px',
      disableClose: true,
      data: {} //SET OUTPUT DATA KEYS
    });

    //SET BEER DATA FROM FORM
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        let beer = Object.assign({}, result)
        beer['masterBreweryKey'] = result.brewery.masterBreweryKey
        let brewname = beer.brewery.name
        delete beer.brewery
        delete beer.id
        this.beerCollection.add(beer)
          .then(ref => {
            this.snackBar.open(brewname + " " + beer.name + " Added", "OK", {
              duration: 2000,
            })
          })
      }
    });
  }

  openBrewDialog(): void {
    const dialogRef = this.dialog.open(DialogAddBreweryDialog, {
      width: '500px',
      disableClose: true,
      data: {} //SET OUTPUT DATA KEYS
    });

    //BREWERY INFORMATION FROM FORM
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        let brewery = Object.assign({ 'icon': new IconNamePipe().transform(result.name) }, result)
        this.breweryCollection.add(brewery)
          .then(ref => {
            this.snackBar.open(brewery.name + " Added", "OK", {
              duration: 1000,
            })
          })
      }
    });
  }

  editDialog() {
    if (this.selectedBeer) {
      let input = Object.assign({}, this.selectedBeer)
      if (input.icon)
        input.icon = new IconNamePipe().transform(input.name)
      const dialogRef = this.dialog.open(DialogAddBeerDialog, {
        width: '500px',
        disableClose: true,
        data: input
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          let beer = Object.assign({}, result)
          if (result.brewery.masterBreweryKey)
            beer['masterBreweryKey'] = result.brewery.masterBreweryKey
          let brewname = beer.brewery.name
          let id = beer.id
          delete beer.brewery
          delete beer.id
          console.log(beer)
          this.beerCollection.doc(id).update(beer)
            .then(ref => {
              this.snackBar.open(brewname + " " + beer.name + " Updated", "OK", {
                duration: 2000,
              })
            })
        }
      });
    }
  }

  onSelect(b: Beer) {
    let x: Beer = b
    // console.log(b)
    // console.log(this.keyword)
    // this.selectedBeer = b
    console.log(x)
  }

}




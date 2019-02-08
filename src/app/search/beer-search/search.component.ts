import { Component, OnInit, Inject } from '@angular/core';
import { Observable, Subject, Subscription, of, BehaviorSubject } from 'rxjs';
import { Beer } from '@shared/interfaces/beer';
import { AngularFirestoreCollection, AngularFirestore, AngularFirestoreDocument, DocumentChangeAction } from '@angular/fire/firestore';
import { Brewery } from '@shared/interfaces/brewery';
import { Item } from '@shared/interfaces/item';
import { environment } from '@environments/environment';
import { AngularFireStorage } from '@angular/fire/storage';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import { combineLatest, defer } from 'rxjs'
import { map, switchMap, startWith, concat } from 'rxjs/operators';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { DialogAddBeerDialog } from '../beer-form/form.component';
import { transformAll } from '@angular/compiler/src/render3/r3_ast';
import { IconNamePipe } from '@shared/pipes/icon-name.pipe';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import * as _ from "lodash";
import { TitlecasePipe } from '@shared/pipes/titlecase.pipe';
import { DialogAddBreweryDialog } from '../brewery-form/form.component';
import { DataService } from '@shared/services/data.service';
import { TransactionFormComponent } from '../transaction-form/transaction-form.component';
import { Transaction } from '@shared/interfaces/transaction';
import { ActivatedRoute } from '@angular/router';

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
  filteredBreweries: Brewery[] = []
  typeList: string[] = []
  filteredTypes: Observable<string[]>
  filters = {}
  searchForm: FormGroup
  selectedBeer: Beer
  client: string
  constructor(private afs: AngularFirestore,
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
    private fb: FormBuilder,
    public service: DataService,
    public route: ActivatedRoute,
    private storage: AngularFireStorage) { }

  ngOnInit() {
    this.buildForm()
    this.service.beerCollection
      .subscribe((beers: Beer[]) => {
        this.beerList = []
        beers.forEach((val) => {
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
          .map(value => {
            if (value)
              return this.typeList.filter(type => type.includes(value.toLowerCase()))
          })
        this.applyFilters()
      })


    //GET BREWERY LIST
    this.service.breweryCollection
      .subscribe((breweries) => {
        this.breweryList = breweries
      })
    this.searchForm.get('keyword').valueChanges
      .subscribe(value => {
        let filterword = typeof value === 'object' ? value.name : value
        this.filteredBreweries = this._instafilter(filterword)
      })
  }

  private _instafilter(value: string): Brewery[] {
    if (value)
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
    this.filteredBeerList = _.filter(this.beerList, _.conforms(this.filters))
    // .sort((a, b) => {
    //   let t1 = a.withBrewery ? a.brewery.name + " " + a.name : a.name
    //   let t2 = b.withBrewery ? b.brewery.name + " " + b.name : b.name
    //   if (t1 > t2) return 1
    //   if (t1 < t2) return -1
    //   return 0
    // })
  }

  filterBrewery() {
    let b = this.searchForm.get('keyword').value as Brewery
    this.filters['masterBreweryKey'] = val => val == b.id
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
    return b.value.iconLoc
  }

  openBeerDialog(): void {
    const dialogRef = this.dialog.open(DialogAddBeerDialog, {
      width: '500px',
      disableClose: true,
      data: {}
    });

    //SET BEER DATA FROM FORM
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log(result)
        let beer = Object.assign({ 'active': true }, result)
        let key = beer.brewery.name.toLowerCase() + " " + beer.name.toLowerCase()
        let brewname = typeof beer.brewery === 'string' ? beer.brewery : beer.brewery.name
        delete beer.brewery
        delete beer.id
        delete beer.iconLoc
        if (result.brewery.id) {
          beer['masterBreweryKey'] = result.brewery.id
          this.service.beerFirestoreList.doc(key).set(beer)
            .then(ref => {
              this.snackBar.open(brewname + " " + beer.name + " Added", "OK", {
                duration: 2000,
              })
            })
        } else this.snackBar.open(beer.name + " was not added! - You need to add " + brewname + " to the Brewery List first.", "OK")
      }
      this.service.selectedBeer = null
    });
  }

  editBeerDialog(): void {
    const dialogRef = this.dialog.open(DialogAddBeerDialog, {
      width: '500px',
      disableClose: true,
      data: this.service.selectedBeer
    });

    //SET BEER DATA FROM FORM
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        let beer = Object.assign({ 'active': true }, result)
        let brewname = typeof beer.brewery === 'string' ? beer.brewery : beer.brewery.name
        delete beer.brewery
        delete beer.id
        delete beer.iconLoc
        if (this.service.selectedBeer && result.masterBreweryKey) {
          beer['masterBreweryKey'] = result.masterBreweryKey
          this.service.beerFirestoreList.doc(this.service.selectedBeer.id).update(beer)
            .then(ref => {
              this.snackBar.open(brewname + " " + beer.name + " has been edited", "OK", {
                duration: 2000,
              })
            })
          this.service.selectedBeer = null
        } else this.snackBar.open(beer.name + " was not added! - You need to add " + brewname + "to the Brewery List first.", "OK")
      }
    });
  }

  openBrewDialog(): void {
    const dialogRef = this.dialog.open(DialogAddBreweryDialog, {
      width: '500px',
      disableClose: true,
      data: this.beerList
    });

    //BREWERY INFORMATION FROM FORM
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        let brewery = Object.assign({ 'icon': new IconNamePipe().transform(result.name), 'active': true }, result)
        let key = brewery.name.toLowerCase()
        this.service.breweryFirestoreList.doc(key).set(brewery)
          .then(ref => {
            this.snackBar.open(brewery.name + " Added", "OK", {
              duration: 2000,
            })
          })
      }
    });
  }

  removeBeer() {
    if (confirm("Are you sure you want to delete this Beer?")) {
      this.service.beerFirestoreList.doc(this.service.selectedBeer.id).update({
        'active': false
      })
    }
    this.service.selectedBeer = null
  }


  openTransactionDialog() {
    this.service.selectedBeer = this.selectedBeer
    let localBeerList = this.service.localFirestoreList
    const dialogRef = this.dialog.open(TransactionFormComponent, {
      width: '500px',
      height: '75vh',
      disableClose: true,
      data: {}
    });


    //SET BEER DATA FROM FORM
    dialogRef.afterClosed().subscribe(result => {
      if (result) {

        let brewname = this.service.selectedBeer.withBrewery ? this.service.selectedBeer.brewery.name + " " + this.service.selectedBeer.name : this.service.selectedBeer.name
        if (result.action == 'swap') {
          delete result.action
          console.log(result)
          result['soldOut'] = false
          localBeerList.doc(result.id).update(result)
            .then(ref => {
              this.snackBar.open(brewname + " has been swapped into your menu", "OK", {
                duration: 2000,
              })
            }).then(ref => {
              this.route.parent.params.subscribe(bar => {
                let trans: Transaction = {
                  client: bar['client'],
                  itemIn: this.service.selectedBeer.id,
                  itemOut: result.beerID,
                  timestamp: this.service.timestamp()
                }
                this.afs.collection('masterBeerTransactions').add(trans)
              })
            })
        } else {
          delete result.action
          result['soldOut'] = false
          localBeerList.add(result)
            .then(ref => {
              this.route.parent.params.subscribe(bar => {
                let trans: Transaction = {
                  client: bar['client'],
                  itemIn: this.service.selectedBeer.id,
                  timestamp: this.service.timestamp()
                }
                this.afs.collection('masterBeerTransactions').add(trans)
              })
              this.snackBar.open(brewname + " has been added to your menu", "OK", {
                duration: 2000,
              })
            })
        }
        this.onClick(this.selectedBeer)
      }
    })
  }

  getRoute() {
    this.route.parent.params.subscribe(val => {
      return val
    })
  }

  showButton(b: Beer) {
    if (!this.selectedBeer)
      return false
    return b.id == this.selectedBeer.id
  }

  onClick(beer: Beer) {
    this.isSelected(beer) ? this.selectedBeer = null : this.selectedBeer = beer
  }

  isSelected(beer: Beer) {
    if (this.selectedBeer)
      return this.selectedBeer.id == beer.id
    return false
  }
}




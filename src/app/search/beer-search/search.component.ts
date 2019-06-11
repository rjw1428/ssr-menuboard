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
import { Localbeer } from '@shared/interfaces/localbeer';
import { firestore } from 'firebase/app';
import { AuthService } from '@shared/services/auth.service';

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
  filteredBeers: Observable<Beer[]>
  stateList: string[] = []
  filteredStates: Observable<string[]>
  filters = {}
  searchForm: FormGroup
  selectedBeer: Beer
  client: string
  localMenu: Localbeer[] = []
  searchMode: boolean = true;
  advancedSearch: boolean;
  constructor(private afs: AngularFirestore,
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
    private fb: FormBuilder,
    public service: DataService,
    public route: ActivatedRoute,
    private storage: AngularFireStorage,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.buildForm()
    this.service.beerCollection
      .subscribe((beers: Beer[]) => {
        this.beerList = []
        beers.forEach((val) => {
          let temp = val
          if (val.type != null) {
            temp['type'] = new TitlecasePipe().transform(val.type)
            this.typeList.push(val.type.toLowerCase())
          }
          this.beerList.push(temp)
          if (val.brewery.state != null)
            this.stateList.push(val.brewery.state.substr(5).toLowerCase())
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

        this.stateList = this.stateList.filter((val, index, self) => self.indexOf(val) === index).sort((a, b) => {
          if (a > b) return 1
          if (a < b) return -1
          return 0
        })
        this.filteredStates = this.searchForm.get('state').valueChanges
          .map(value => {
            if (value)
              return this.stateList.filter(state => state.includes(value.toLowerCase()))
          })

        this.filteredBeers = this.searchForm.get('beer').valueChanges
          .map(value => {
            let filterword = typeof value === 'object' ? value.id : value
            if (filterword.length == 0) {
              return null
            }
            return this.beerList.filter(beer => beer.id.includes(filterword.toLowerCase()))
          })
        this.applyFilters()
      })
    this.route.parent.params.switchMap(val => {
      return this.service.getLocalCollection(val['client'])
    }).subscribe(val => this.localMenu = val)


    //GET BREWERY LIST
    this.service.breweryCollection
      .subscribe((breweries) => {
        this.breweryList = breweries
      })
    this.searchForm.get('brewery').valueChanges
      .subscribe(value => {
        let filterword = typeof value === 'object' ? value.name : value
        this.filteredBreweries = this._instafilter(filterword)
      })
  }

  private _instafilter(value: string): Brewery[] {
    if (value.length == 0) {
      // this.resetKeyword()
      return this.breweryList
    }
    if (value)
      return this.breweryList.filter((brew: Brewery) => brew.name.toLowerCase().indexOf(value.toLowerCase()) === 0)
  }

  buildForm() {
    this.searchForm = this.fb.group({
      brewery: '',
      type: '',
      beer: '',
      state: ''
    })
  }

  resetBrewery() {
    this.searchForm.setValue({
      'brewery': '',
      'type': this.searchForm.get('type').value,
      'beer': this.searchForm.get('beer').value,
      'state': this.searchForm.get('state').value,
    })
    this.removeFilter('brewery')
  }

  resetType() {
    this.searchForm.setValue({
      'brewery': this.searchForm.get('brewery').value,
      'type': '',
      'beer': this.searchForm.get('beer').value,
      'state': this.searchForm.get('state').value,
    })
    this.removeFilter('type')
  }

  resetBeer() {
    this.searchForm.setValue({
      'brewery': this.searchForm.get('brewery').value,
      'type': this.searchForm.get('type').value,
      'beer': '',
      'state': this.searchForm.get('state').value,
    })
    this.removeFilter('id')
  }

  resetState() {
    this.searchForm.setValue({
      'brewery': this.searchForm.get('brewery').value,
      'type': this.searchForm.get('type').value,
      'beer': this.searchForm.get('beer').value,
      'state': ''
    })
    this.removeFilter('brewery')
  }

  applyFilters() {
    if (Object.keys(this.filters).length > 0)
      this.filteredBeerList = _.filter(this.beerList, _.conforms(this.filters))
    else
      this.filteredBeerList = this.beerList
    // console.log("error")

    // .sort((a, b) => {
    //   let t1 = a.withBrewery ? a.brewery.name + " " + a.name : a.name
    //   let t2 = b.withBrewery ? b.brewery.name + " " + b.name : b.name
    //   if (t1 > t2) return 1
    //   if (t1 < t2) return -1
    //   return 0
    // })
  }

  filterBrewery() {
    let b = this.searchForm.get('brewery').value as Brewery
    this.filters['brewery'] = (val: Brewery) => val.name == b.name
    this.applyFilters()
  }

  filterType() {
    let t = this.searchForm.get('type').value
    this.filters['type'] = val => val.toLowerCase() == t
    this.applyFilters()
  }

  filterBeer() {
    let beer = this.searchForm.get('beer').value as Beer
    this.filters['id'] = val => val == beer.id
    this.applyFilters()
  }

  filterState() {
    let s = this.searchForm.get('state').value
    this.filters['brewery'] = (val: Brewery) => val.state.toLowerCase().substr(5) == s
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

  displayState(t: string) {
    let x = new TitlecasePipe().transform(t)
    return x
  }

  displayTitle(beer: Beer) {
    return beer.withBrewery ? beer.brewery.name + " " + beer.name : beer.name
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
        let beer = Object.assign({ 'active': true }, result)
        let brewname = typeof beer.brewery === 'string' ? beer.brewery : beer.brewery.name
        if (result.brewery.id) {
          let key = beer.brewery.name.toLowerCase() + " " + beer.name.toLowerCase()
          delete beer.brewery
          delete beer.id
          delete beer.iconLoc
          beer['masterBreweryKey'] = result.brewery.id
          beer['createdBy'] = this.authService.username
          this.service.beerFirestoreList.doc(key).set(beer)
            .then(ref => {
              this.snackBar.open(brewname + " " + beer.name + " Added", "OK", {
                duration: 3000,
              })
            })
        } else this.snackBar.open(beer.name + " was not added! - You need to add " + brewname + " to the Brewery List first.", "OK")
      }
      this.selectedBeer = null
    });
  }

  editBeerDialog(): void {
    const dialogRef = this.dialog.open(DialogAddBeerDialog, {
      width: '500px',
      disableClose: true,
      data: this.selectedBeer
    });

    //SET BEER DATA FROM FORM
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        let beer = Object.assign({ 'active': true }, result)
        let brewname = typeof beer.brewery === 'string' ? beer.brewery : beer.brewery.name
        if (beer.brewery.id) {
          let breweryID = beer.brewery.id
          delete beer.brewery
          delete beer.id
          delete beer.iconLoc
          if (this.selectedBeer) {
            beer['masterBreweryKey'] = breweryID
            beer['modifiedBy'] = this.authService.username
            this.service.beerFirestoreList.doc(this.selectedBeer.id).update(beer)
              .then(ref => {
                this.snackBar.open(brewname + " " + beer.name + " has been edited", "OK", {
                  duration: 3000,
                })
              })
          }
          this.selectedBeer = null
        } else this.snackBar.open(beer.name + " was not updated! - You need to add " + brewname + " to the Brewery List first.", "OK")
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
    dialogRef.afterClosed()
      .subscribe(result => {
        if (result) {
          let brewery = Object.assign({ 'icon': new IconNamePipe().transform(result.name), 'active': true, 'createdBy': this.authService.username }, result)
          let key = brewery.name.toLowerCase()
          console.log(brewery)
          this.service.breweryFirestoreList.doc(key).set(brewery)
            .then(ref => {
              this.snackBar.open(brewery.name + " Added", "OK", {
                duration: 3000,
              })
            })
        }
      });
  }

  removeBeer() {
    if (confirm("Are you sure you want to delete this Beer?")) {
      this.service.beerFirestoreList.doc(this.selectedBeer.id).update({
        'active': false
      })
    }
    this.selectedBeer = null
  }


  openTransactionDialog() {
    this.service.selectedIndex = null
    this.service.selectedLocal = null
    const dialogRef = this.dialog.open(TransactionFormComponent, {
      width: '500px',
      height: '90vh',
      disableClose: true,
      data: this.selectedBeer
    });


    //SET BEER DATA FROM FORM
    dialogRef.afterClosed()
      .subscribe(result => {
        if (result) {
          console.log(this.service.selectedIndex)
          let brewname = this.selectedBeer.withBrewery ? this.selectedBeer.brewery.name + " " + this.selectedBeer.name : this.selectedBeer.name
          if (this.service.selectedIndex != null) {
            let swapMenu = this.localMenu
            swapMenu[this.service.selectedIndex] = result
            swapMenu.forEach(beerItem => {
              delete beerItem.beer
            })
            this.service.localFirestoreList.update({
              beerList: swapMenu
            })
              .then(ref => {
                this.snackBar.open(brewname + " has been swapped into your menu", "OK", {
                  duration: 3000,
                })
              })
          }
          else {
            delete result.beer
            this.service.localFirestoreList.update({
              beerList: firestore.FieldValue.arrayUnion(result)
            })
              .then(ref => {
                this.snackBar.open(brewname + " has been added to your menu", "OK", {
                  duration: 3000,
                })
              })
            // console.log(result)
          }

          // .then(ref => {
          //   this.route.parent.params.subscribe(bar => {
          //     let trans: Transaction = {
          //       client: bar['client'],
          //       itemIn: (this.selectedBeer ? this.selectedBeer.id : ''),
          //       itemOut: (this.service.selectedLocal ? this.service.selectedLocal.id : ''),
          //       timestamp: this.service.timestamp()
          //     }
          //     this.afs.collection('masterBeerTransactions').add(trans)
          //   })
          // })
        }
      })
    // this.onClick(this.selectedBeer)
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

  clearSelect(b: Beer) {
    if (!b)
      this.selectedBeer = null
    if (this.selectedBeer)
      if (b.id != this.selectedBeer.id)
        this.selectedBeer = null
  }

  toggleSearch() {
    this.searchMode = !this.searchMode
  }

  toggleAdvanced() {
    this.advancedSearch = !this.advancedSearch
    this.resetType()
    this.resetBrewery()
    this.resetState()
  }
}




import { Component, OnInit } from '@angular/core';
import { AngularFirestoreCollection, AngularFirestore } from '@angular/fire/firestore';
import { Brewery } from '@shared/interfaces/brewery';
import { AngularFireStorage } from '@angular/fire/storage';
import { environment } from '@environments/environment';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatDialog, MatSnackBar } from '@angular/material';
import { DialogAddBreweryDialog } from '../brewery-form/form.component';
import { IconNamePipe } from '@shared/pipes/icon-name.pipe';
import { startWith, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import * as _ from "lodash";

@Component({
  selector: 'app-brewery-search',
  templateUrl: './brewery-search.component.html',
  styleUrls: ['./brewery-search.component.css']
})
export class BrewerySearchComponent implements OnInit {
  breweryCollection: AngularFirestoreCollection<Brewery>
  filteredBreweries: Observable<Brewery[]>
  mainFilteredList: Brewery[] = []
  breweryList: Brewery[] = []
  stateList: string[] = []
  filteredStates: Observable<string[]>
  searchForm: FormGroup
  filters = {}
  constructor(
    private afs: AngularFirestore,
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
    private fb: FormBuilder,
    private storage: AngularFireStorage) { }

  ngOnInit() {
    this.buildForm()
    this.breweryCollection = this.afs.collection('masterBreweryList', ref => {
      return ref.limit(100).orderBy('name')
    })
    this.breweryCollection
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
          this.stateList.push(el.state)
          this.breweryList.push(el)
        })
        this.stateList = this.stateList.filter((val, index, self) => self.indexOf(val) === index).sort((a, b) => {
          if (a > b) return 1
          if (a < b) return -1
          return 0
        })
        this.breweryList.sort((a, b) => {
          if (a.name > b.name) return 1
          if (a.name < b.name) return -1
          return 0
        })
        this.filteredStates = this.searchForm.get('state').valueChanges
          .pipe(startWith(''),
            map(value => {
              return this.stateList.filter(type => type.includes(value.toLowerCase()))
            })
          )
        this.filteredBreweries = this.searchForm.get('name').valueChanges
          .pipe(startWith<string | Brewery>(''),
            map((value: any) => typeof value === 'object' ? value.name : value),
            map((brew: string) => brew ? this._instafilter(brew) : this.breweryList.slice())
          )
        this.applyFilters()
      })
  }
  private _instafilter(value: string): Brewery[] {
    if (!value)
      return [];
    return this.breweryList.filter((brew: Brewery) => brew.name.toLowerCase().indexOf(value.toLowerCase()) === 0)
  }

  buildForm() {
    this.searchForm = this.fb.group({
      name: '',
      state: ''
    })
  }
  displayName(brewery: Brewery) {
    return brewery.name
  }

  displayState(state: String) {
    return state
  }

  filterName() {
    let b = this.searchForm.get('name').value as Brewery
    this.filters['masterBreweryKey'] = val => val == b.masterBreweryKey
    this.applyFilters()
  }

  filterState() {
    let s = this.searchForm.get('state').value as string
    this.filters['state'] = val => val == s
    this.applyFilters()
  }

  applyFilters() {
    this.mainFilteredList = _.filter(this.breweryList, _.conforms(this.filters)).sort((a, b) => {
      if (a.name > b.name) return 1
      if (a.name < b.name) return -1
      return 0
    })
  }

  resetName() {
    this.searchForm.setValue({
      'name': '',
      'state': this.searchForm.get('state').value
    })
    this.removeFilter('masterBreweryKey')
  }

  resetState() {
    this.searchForm.setValue({
      'name': this.searchForm.get('name').value,
      'state': ''
    })
    this.removeFilter('state')
  }

  removeFilter(property: string) {
    delete this.filters[property]
    this[property] = null
    this.applyFilters()
  }

  isSelectedValue(b: any) {
    return b.value.masterBreweryKey ? true : false
  }

  parseSelectionForIcon(b: any) {
    return b.value.icon
  }


  openDialog(): void {
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
            // brewery.masterBreweryKey = ref.id
            // let addnew = Object.assign({}, this.beerForm.value)
            // addnew['brewery'] = brewery
            // this.beerForm.setValue(addnew)
          })
      }
    });
  }

}

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
import { Observable, of } from 'rxjs';
import * as _ from "lodash";
import { DataService } from '@shared/services/data.service';

@Component({
  selector: 'app-brewery-search',
  templateUrl: './brewery-search.component.html',
  styleUrls: ['./brewery-search.component.css']
})
export class BrewerySearchComponent implements OnInit {
  breweryCollection: AngularFirestoreCollection<Brewery>
  filteredBreweries: Brewery[] = []
  mainFilteredList: Brewery[] = []
  breweryList: Brewery[] = []
  stateList: string[] = []
  filteredStates: Observable<string[]>
  searchForm: FormGroup
  filters = {}
  selectedBrewery: Brewery
  constructor(
    private afs: AngularFirestore,
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
    private fb: FormBuilder,
    private storage: AngularFireStorage,
    public service: DataService) { }

  ngOnInit() {
    this.buildForm()
    this.service.breweryCollection
      .subscribe((breweries) => {
        this.breweryList = breweries
        breweries.forEach(el => {
          this.stateList.push(el.state)
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
          .pipe(
            map(value => {
              if (value)
                return this.stateList.filter(state => {
                  return state ? state.toLowerCase().includes(value.toLowerCase()) : 0
                })
            })
          )
        this.searchForm.get('name').valueChanges
          .subscribe(value => {
            let filterword = typeof value === 'object' ? value.name : value
            this.filteredBreweries = this._instafilter(filterword)
          })
        this.applyFilters()
      })
  }
  private _instafilter(value: string): Brewery[] {
    if (value)
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
    this.filters['id'] = val => val == b.id
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
    this.removeFilter('id')
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
    return b.value.iconLoc
  }


  openDialog(): void {
    this.service.selectedBrewery = this.selectedBrewery
    const dialogRef = this.dialog.open(DialogAddBreweryDialog, {
      width: '500px',
      disableClose: true,
      data: {}
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
        this.onClick(this.selectedBrewery)
      }
    });
  }

  editDialog(): void {
    this.service.selectedBrewery = this.selectedBrewery
    const dialogRef = this.dialog.open(DialogAddBreweryDialog, {
      width: '500px',
      disableClose: true,
      data: this.service.selectedBrewery
    });

    //BREWERY INFORMATION FROM FORM
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        let brewery
        if (typeof result.name === 'object') {
          brewery = Object.assign({ 'icon': result.name.icon }, result)
          let x = brewery.name.name
          let key = brewery.name.id
          delete brewery.name
          brewery['name'] = x
          console.log(brewery)
          this.service.breweryFirestoreList.doc(key).update(brewery)
            .then(ref => {
              this.snackBar.open(brewery.name + " has been edited", "OK", {
                duration: 2000,
              })
            })
          this.service.selectedBrewery = null
        } else this.snackBar.open("An error has occurred while editing " + result.name + " has been edited", "OK", {
          duration: 2000,
        })
        this.onClick(this.selectedBrewery)
      }
    });
  }


  onClick(brewery: Brewery) {
    this.isSelected(brewery) ? this.selectedBrewery = null : this.selectedBrewery = brewery
  }

  isSelected(brewery: Brewery) {
    if (this.selectedBrewery)
      return this.selectedBrewery.id == brewery.id
    return false
  }

  // checkClick() {
  //   this.listItemSelected = true
  // }

  removeBrewery() {
    //if (confirm("Are you sure you want to delete this Brewery?")) {
    //this.breweryCollection.doc(this.service.selectedBrewery.masterBreweryKey).delete()
    //this.fixKey();
    this.service.selectedBrewery = null
    //}
  }

  fixKey() {
    let x = this.selectedBrewery
    delete x.iconLoc
    this.service.breweryFirestoreList.doc(x.id).set(x)
    // let hold = this.service.selectedBrewery as Brewery
    // this.service.breweryFirestoreList.doc(hold.key).delete()
    // let name = hold.name
    // delete hold.key
    // delete hold.name
    // this.service.breweryFirestoreList.doc(name).set(hold)
  }
}

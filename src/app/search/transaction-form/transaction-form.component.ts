import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatSnackBar, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Beer } from '@shared/interfaces/beer';
import { DialogAddBeerDialog } from '../beer-form/form.component';
import { DataService } from '@shared/services/data.service';
import { AngularFirestore, DocumentChangeAction, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Localbeer } from '@shared/interfaces/localbeer';
import { defer, Observable } from 'rxjs';
import { combineLatest, map, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-transaction-form',
  templateUrl: './transaction-form.component.html',
  styleUrls: ['./transaction-form.component.css']
})

export class TransactionFormComponent implements OnInit {
  localBeerList: Observable<Localbeer[]>
  beerList: Localbeer[] = []
  selected: Localbeer
  swap: boolean
  addingBeerName: string
  constructor(public dialog: MatDialog,
    public dialogRef: MatDialogRef<DialogAddBeerDialog>,
    @Inject(MAT_DIALOG_DATA)
    public input: Beer[], private service: DataService,
    private afs: AngularFirestore) { }

  ngOnInit() {
    this.addingBeerName = this.service.selectedBeer.withBrewery ? this.service.selectedBeer.brewery.name + " " + this.service.selectedBeer.name : this.service.selectedBeer.name
    this.localBeerList = this.service.localCollection.map(vals => vals.sort((a, b) => {
      let t1 = a.beer.withBrewery ? a.beer.brewery.name + " " + a.beer.name : a.beer.name
      let t2 = b.beer.withBrewery ? b.beer.brewery.name + " " + b.beer.name : b.beer.name
      if (t1 > t2) return 1
      if (t1 < t2) return -1
      return 0
    }))
    this.initializeForm()
  }
  initializeForm() {
    this.selected = {
      price: '',
      local_description: '',
      beer: null,
      beerID: '',
      onDeck: false,
      onSpecial: true,
    }
  }
  onAdd() {
    let obj = {
      action: 'add',
      beerID: this.service.selectedBeer.id,
      price: this.selected.price,
      local_description: this.selected.local_description,
      onDeck: this.selected.onDeck,
      onSpecial: this.selected.onSpecial,
    }
    return obj
  }

  showMenuBeers() {
    let x
    this.localBeerList.subscribe(vals => {
      x = vals.length
    })
    return x > 0
  }

  onSelect(b) {
    this.selected = b
    if (!this.selected.onDeck)
      this.selected.onDeck = false
    if (!this.selected.onSpecial)
      this.selected.onSpecial = false
    if (!this.selected.local_description)
      this.selected.local_description = ''
    this.swap = true;
    console.log(this.selected)
  }

  onSwap() {
    let obj = {
      action: 'swap',
      id: this.selected.id,
      beerID: this.service.selectedBeer.id,
      price: this.selected.price,
      local_description: this.selected.local_description,
      onDeck: this.selected.onDeck,
      onSpecial: this.selected.onSpecial,
    }
    return obj
  }

  setName(beer: Beer) {
    return beer.withBrewery ? `${beer.brewery.name} ${beer.name}` : beer.name
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  clearSelected() {
    this.selected = null
    this.initializeForm()
    this.swap = false;
  }

  setHighlight(beerID: string) {
    if (!this.selected)
      return false
    return beerID == this.selected.beerID
  }

  setColor() {
    return this.swap ? "warn" : "primary"
  }
}

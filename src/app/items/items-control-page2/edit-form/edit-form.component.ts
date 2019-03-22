import { Component, OnInit, Inject, Input } from '@angular/core';
import { Localbeer } from '@shared/interfaces/localbeer';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DialogAddBeerDialog } from 'app/search/beer-form/form.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { getTestBed } from '@angular/core/testing';
import { Beer } from '@shared/interfaces/beer';
import { DataService } from '@shared/services/data.service';
import { Observable, Subscribable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-edit-form',
  templateUrl: './edit-form.component.html',
  styleUrls: ['./edit-form.component.css']
})
export class EditFormComponent implements OnInit {
  beerList: Beer[] = []
  filteredBeers: Observable<Beer[]>
  selected: Localbeer
  beerName: string
  editForm: FormGroup
  constructor(public dialog: MatDialog,
    public dialogRef: MatDialogRef<DialogAddBeerDialog>,
    @Inject(MAT_DIALOG_DATA)
    public input: Localbeer,
    private fb: FormBuilder,
    private service: DataService) {
  }

  ngOnInit() {
    this.initializeForm()
    this.service.beerCollection.subscribe(vals => {
      this.beerList = vals
      this.filteredBeers = this.editForm.get('beer').valueChanges.shareReplay(1)
        .map(value => {
          if (typeof value === 'string')
            return this.beerList.filter(beer => {
              let title = beer.withBrewery ? beer.brewery.name + " " + beer.name : beer.name
              return title.toLowerCase().includes(value.toLowerCase())
            })
        })
    })
    this.beerName = this.input.beer.withBrewery ? this.input.beer.brewery.name + " " + this.input.beer.name : this.input.beer.name
  }

  displayName(beer: Beer) {
    let title = beer.withBrewery ? beer.brewery.name + " " + beer.name : beer.name
    return title
  }

  initializeForm() {
    this.editForm = this.fb.group({
      price: this.input.price ? this.input.price : '',
      local_description: this.input.local_description ? this.input.local_description : '',
      beer: [this.input.beer ? this.input.beer : {}, [Validators.required]],
      // beerID: [this.input.beerID ? this.input.beerID : '', [Validators.required]],
      onDeck: this.input.onDeck ? true : false,
      onSpecial: this.input.onSpecial ? true : false,
    })
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onAdd() {
    return this.editForm.value
  }

  resetBeer() {
    let reset = Object.assign({}, this.editForm.value)
    reset['beer'] = ''
    // reset['beerID'] = ''
    this.editForm.setValue(reset)
  }

  parseSelectionForIcon(b: Beer) {
    return b.iconLoc
  }

  // isSelectedValue(b: any) {
  //   return b.value.masterBreweryKey ? true : false
  // }
}

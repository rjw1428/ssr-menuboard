import { Component, OnInit, Inject, Input } from '@angular/core';
import { Localbeer } from '@shared/interfaces/localbeer';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DialogAddBeerDialog } from 'app/search/beer-form/form.component';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-edit-form',
  templateUrl: './edit-form.component.html',
  styleUrls: ['./edit-form.component.css']
})
export class EditFormComponent implements OnInit {
  selected: Localbeer
  beerName: string
  editForm: FormGroup
  constructor(public dialog: MatDialog,
    public dialogRef: MatDialogRef<DialogAddBeerDialog>,
    @Inject(MAT_DIALOG_DATA)
    public input: Localbeer,
    private fb: FormBuilder) { }

  ngOnInit() {
    this.initializeForm()
    this.beerName = this.input.beer.withBrewery ? this.input.beer.brewery.name + " " + this.input.beer.name : this.input.beer.name

  }

  displayName(local: Localbeer) {
    return local.beer.withBrewery ? local.beer.brewery.name + " " + local.beer.name : local.beer.name
  }

  initializeForm() {
    this.editForm = this.fb.group({
      id: this.input.id,
      price: this.input.price ? this.input.price : '',
      local_description: this.input.local_description ? this.input.local_description : '',
      beer: this.input.beer ? this.input.beer : null,
      beerID: this.input.beerID ? this.input.beerID : '',
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
}

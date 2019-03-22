import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DialogAddBeerDialog } from 'app/search/beer-form/form.component';

@Component({
  selector: 'app-view-form',
  templateUrl: './view-form.component.html',
  styleUrls: ['./view-form.component.css']
})
export class ViewFormComponent implements OnInit {
  viewForm: FormGroup
  properties: any
  constructor(public dialog: MatDialog,
    public dialogRef: MatDialogRef<DialogAddBeerDialog>,
    @Inject(MAT_DIALOG_DATA)
    public input,
    private fb: FormBuilder) { }

  ngOnInit() {
    this.buildForm()
  }

  onSave() {
    return this.viewForm.value
  }

  buildForm() {
    this.viewForm = this.fb.group({
      abv: this.input.abv,//this.input.abv,
      ibu: this.input.ibu,//this.input.ibu,
      description: this.input.description,//this.input.description,
      local_description: this.input.local_description,
      location: this.input.location,
      type: this.input.type,//this.input.type,
      price: this.input.price
    })
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}

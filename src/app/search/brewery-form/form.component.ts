import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Brewery } from '@shared/interfaces/brewery';

@Component({
  selector: 'dialog-add-brewery-dialog',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class DialogAddBreweryDialog {
  states = ["AL", "AK", "AS", "AZ", "AR", "CA", "CO", "CT", "DE", "DC", "FL", "GA", "GU", "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD", "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH",
    "NJ", "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "PR", "RI", "SC", "SD", "TN", "TX", "UT", "VT", "VI", "VA", "WA", "WV", "WI", "WY"
  ]
  countries = ["US"]
  constructor(
    public dialogRef: MatDialogRef<DialogAddBreweryDialog>,
    @Inject(MAT_DIALOG_DATA) public input: any) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onAdd(input) {
    return input
  }
}
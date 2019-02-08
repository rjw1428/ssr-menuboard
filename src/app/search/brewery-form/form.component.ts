import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Brewery } from '@shared/interfaces/brewery';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AngularFirestore } from '@angular/fire/firestore';
import { startWith, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { DataService } from '@shared/services/data.service';

@Component({
  selector: 'dialog-add-brewery-dialog',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class DialogAddBreweryDialog {
  states = ["AL - Alabama", "AK - Alaska", "AZ - Arizona", "AR - Arkansas", "CA - California", "CO - Colorado", "CT - Conneticut", "DE - Delaware", "DC - District of Columbia", "FL - Florida", "GA - Georgia",
    "GU - Guam", "HI - Hawaii", "ID - Idaho", "IL - Illinois", "IN - Indiana", "IA - Iowa", "KS - Kansas", "KY - Kentucky", "LA - Louisiana", "ME - Maine", "MD - Maryland", "MA - Massachusetts", "MI - Michigan",
    "MN - Minnesota", "MS - Mississippi", "MO - Missouri", "MT - Montana", "NE - Nebraska", "NV - Nevada", "NH - New Hampshire",
    "NJ - New Jersey", "NM - New Mexico", "NY - New York", "NC - North Carolina", "ND - North Dakota", "OH - Ohio", "OK - Oklahoma", "OR - Oregon", "PA - Pennsylvania", "PR - Puerto Rico", "RI - Rhode Island",
    "SC - South Carolina", "SD - South Dakota", "TN - Tennessee", "TX - Texas", "UT - Utah", "VT - Vermont", "VA - Virginia", "WA - Washington", "WV - West Virginia", "WI - Wisconsin", "WY - Wyoming"
  ]
  countries = ["US - United States", "UK - United Kingdom", "DE - Germany", "BE - Belgium", "MX - Mexico", "FR - France", "IT - Italy", "IL - Israel", "IE - Ireland", "CA - Canada", "DK - Denmark"]
  breweryForm: FormGroup
  filteredBreweries: Observable<Brewery[]>
  brewList: Brewery[]
  constructor(
    public dialogRef: MatDialogRef<DialogAddBreweryDialog>, private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public input: Brewery, private afs: AngularFirestore, public service: DataService) {
    this.buildForm()
    this.countries.sort((a, b) => this.stringSort(a, b))
    this.states.sort((a, b) => this.stringSort(a, b))

    this.service.breweryCollection.subscribe(vals => {
      this.brewList = vals
      this.filteredBreweries = this.breweryForm.get('name').valueChanges
        .pipe(
          map((value: Brewery) => typeof value === 'object' ? value.name : value),
          map((brew: string) => brew ? this._filter(brew) : [])
        )
    })
  }

  private _filter(value: string): Brewery[] {
    return this.brewList.filter((brewery: Brewery) => brewery.name.toLowerCase().indexOf(value.toLowerCase()) === 0)
  }

  stringSort(a, b) {
    if (a == 'US - United States')
      return -1
    else
      if (a > b) return 1
    if (a < b) return -1
    return 0
  }

  private buildForm() {
    if (this.input)
      this.breweryForm = this.fb.group({
        name: [this.input ? this.input : '', [Validators.required]],
        city: this.input.city ? this.input.city : '',
        state: this.input.state ? this.input.state : '',
        country: this.input.country ? this.input.country : ''
      })
    else
      this.breweryForm = this.fb.group({
        name: ['', [Validators.required]],
        city: '',
        state: '',
        country: ''
      })
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onAdd() {
    return this.breweryForm.value
  }

  displayName(brewery: Brewery) {
    return brewery.name
  }

  resetBrewery() {
    let reset = Object.assign({}, this.breweryForm.value)
    reset['name'] = ''
    this.breweryForm.setValue(reset)
  }
}
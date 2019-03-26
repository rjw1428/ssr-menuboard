import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog, MatSnackBar, MatOptionSelectionChange } from '@angular/material';
import { Beer } from '@shared/interfaces/beer';
import { Brewery } from '@shared/interfaces/brewery';
import { Observable, defer, combineLatest } from 'rxjs';
import { AngularFirestore, DocumentChangeType, AngularFirestoreCollection } from '@angular/fire/firestore';
import { DialogAddBreweryDialog } from '../brewery-form/form.component';
import { IconNamePipe } from '@shared/pipes/icon-name.pipe';
import { SearchComponent } from '../beer-search/search.component';
import { AngularFireStorage } from '@angular/fire/storage';
import { environment } from '@environments/environment';
import { map, switchMap, startWith } from 'rxjs/operators';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataService } from '@shared/services/data.service';
import { AuthService } from '@shared/services/auth.service';

@Component({
  selector: 'dialog-add-beer-dialog',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class DialogAddBeerDialog {
  breweryCollection: AngularFirestoreCollection<Brewery>
  breweryList: Brewery[] = []
  beerNameList: string[] = []
  filteredBreweries: Observable<Brewery[]>
  filteredNames: Observable<string[]>
  beerForm: FormGroup
  constructor(public dialog: MatDialog,
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<DialogAddBeerDialog>,
    @Inject(MAT_DIALOG_DATA)
    public input: Beer,
    private afs: AngularFirestore,
    private storage: AngularFireStorage,
    private fb: FormBuilder,
    private service: DataService,
    private authService: AuthService
    ) {
    this.buildForm()
    this.service.beerCollection.subscribe(vals => {
      vals.forEach(val => {
        this.beerNameList.push(val.name)
      })
      this.filteredNames = this.beerForm.get('name').valueChanges
        .map(value => {
          if (value)
            return this.beerNameList.filter(name => name.toLowerCase().includes(value.toLowerCase()))
        })
    })
    this.service.breweryCollection.subscribe(vals => {
      this.breweryList = vals
      this.filteredBreweries = this.beerForm.get('brewery').valueChanges.pipe(
        map((value) => typeof value === 'string' ? value : value.name),
        map((brew: string) => brew ? this._filter(brew) : [])
      )
    })
  }

  private _filter(value: string): Brewery[] {
    return this.breweryList.filter((brewery: Brewery) => brewery.name.toLowerCase().indexOf(value.toLowerCase()) === 0)
  }

  displayBrewName(brewery: Brewery) {
    return brewery.name
  }

  private buildForm() {
    if (this.input)
      this.beerForm = this.fb.group({
        id: this.input.id ? this.input.id : '',
        brewery: [this.input.brewery ? this.input.brewery : '', [Validators.required]],
        // masterBreweryKey: this.input.masterBreweryKey ? this.input.masterBreweryKey : '',
        name: this.input.name ? this.input.name : '',
        abv: this.input.abv ? this.input.abv : ['', [Validators.pattern("^[0-9]*\.?\[0-9]$"), Validators.maxLength(3)]],
        ibu: this.input.ibu ? this.input.ibu : ['', [Validators.pattern("^[0-9]*$"), Validators.maxLength(3)]],
        type: this.input.type ? this.input.type : '',
        description: this.input.description ? this.input.description : '',
        withBrewery: this.input.withBrewery != null ? this.input.withBrewery === true : '',
        icon: this.input.icon ? this.input.icon : ''
      })
    else {
      this.beerForm = this.fb.group({
        id: '',
        brewery: ['', [Validators.required]],
        // masterBreweryKey: '',
        name: '',
        abv: ['', [Validators.pattern("^[0-9]*\.?\[0-9]$"), Validators.maxLength(3)]],
        ibu: ['', [Validators.pattern("^[0-9]*$"), Validators.maxLength(3)]],
        type: '',
        description: '',
        withBrewery: '',
        icon: ''
      })
    }
  }

  resetBrewery() {
    let reset = Object.assign({}, this.beerForm.value)
    reset['brewery'] = ''
    this.beerForm.setValue(reset)
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
        let brewery = Object.assign({ 'icon': new IconNamePipe().transform(result.name), 'active': true, 'createdBy': this.authService.username}, result)
        let key = brewery.name.toLowerCase()
        brewery['id']=key
        this.service.breweryFirestoreList.doc(key).set(brewery)
          .then(ref => {
            this.snackBar.open(brewery.name + " Added", "OK", {
              duration: 3000,
            })
            //SET NEW BREWERY ON BEER FORM
            let addnew = Object.assign({}, this.beerForm.value)
            addnew['brewery'] = brewery
            this.beerForm.setValue(addnew)
          })
      }
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onAdd() {
    return this.beerForm.value
  }

  parseSelectionForIcon(b: any) {
    return b.value.iconLoc
  }

  isSelectedValue(b: any) {
    return b.value.masterBreweryKey ? true : false
  }
}
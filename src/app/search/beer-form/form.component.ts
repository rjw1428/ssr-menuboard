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

@Component({
  selector: 'dialog-add-beer-dialog',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class DialogAddBeerDialog implements OnInit {
  breweryCollection: AngularFirestoreCollection<Brewery>
  breweryList: Brewery[] = []
  filteredBreweries: Observable<Brewery[]>
  myControl = new FormControl()
  beerForm: FormGroup
  constructor(public dialog: MatDialog,
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<DialogAddBeerDialog>,
    @Inject(MAT_DIALOG_DATA)
    public input: Beer,
    private afs: AngularFirestore,
    private storage: AngularFireStorage,
    private fb: FormBuilder) {
    this.buildForm()
    this.breweryCollection = afs.collection('masterBreweryList', ref => {
      return ref.orderBy('name')
    })
    this.breweryCollection.snapshotChanges()
      .map(vals => {
        return vals
          .map(val => {
            let brewery = val.payload.doc.data() as Brewery
            brewery['masterBreweryKey'] = val.payload.doc.id
            return brewery
          })
      }).subscribe(val => {
        this.breweryList = []
        val.forEach(el => {
          this.storage.ref(environment.itemIconRootAddress + el.icon).getDownloadURL().toPromise()
            .then(value => {
              el.icon = value;
            })
            .catch(e => {
              el.icon = '../../../assets/404icon.png'
            })
          this.breweryList.push(el)
          this.filteredBreweries = this.beerForm.valueChanges
            .pipe(startWith<string | Beer>(''),
              map((value: Beer) => typeof value.brewery === 'object' ? value.brewery.name : value.brewery),
              map((brew: string) => brew ? this._filter(brew) : this.breweryList.slice())
            )
        })
      })
  }

  ngOnInit() {
  }

  private _filter(value: string): Brewery[] {
    if (!value)
      return [];
    return this.breweryList.filter((brewery: Brewery) => brewery.name.toLowerCase().indexOf(value.toLowerCase()) === 0)
  }

  displayName(brewery: Brewery) {
    return brewery.name
  }

  private buildForm() {
    this.beerForm = this.fb.group({
      id: this.input.id ? this.input.id : '',
      brewery: [this.input.brewery ? this.input.brewery : '', [Validators.required]],
      masterBreweryKey: this.input.masterBreweryKey ? this.input.masterBreweryKey : '',
      name: this.input.name ? this.input.name : '',
      abv: this.input.abv ? this.input.abv : '',
      ibu: this.input.ibu ? this.input.ibu : '',
      type: this.input.type ? this.input.type : '',
      description: this.input.description ? this.input.description : '',
      withBrewery: this.input.withBrewery!=null ? this.input.withBrewery === true : '',
      icon: this.input.icon ? this.input.icon : ''
    })
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
        let brewery = Object.assign({ 'icon': new IconNamePipe().transform(result.name) }, result)
        this.breweryCollection.add(brewery)
          .then(ref => {
            this.snackBar.open(brewery.name + " Added", "OK", {
              duration: 1000,
            })
            brewery.masterBreweryKey = ref.id
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
    return b.value.icon
  }

  isSelectedValue(b: any) {
    return b.value.masterBreweryKey ? true : false
  }
}
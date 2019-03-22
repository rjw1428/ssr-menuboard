import { Component, OnInit, OnDestroy } from '@angular/core';
import { Item } from '@shared/interfaces/item';
import * as _ from 'lodash'
import { DataService } from '@shared/services/data.service';
import { Observable, Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Localbeer } from '@shared/interfaces/localbeer';
import { ActivatedRoute, Router } from '@angular/router';
import { EditFormComponent } from './edit-form/edit-form.component';
import { MatDialog, MatSnackBar } from '@angular/material';
import { ViewFormComponent } from './view-form/view-form.component';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { firestore } from 'firebase/app';
import { Beer } from '@shared/interfaces/beer';

@Component({
  selector: 'app-items-control-page2',
  templateUrl: './items-control-page2.component.html',
  styleUrls: ['./items-control-page2.component.scss']
})
export class ItemsControlPage2Component implements OnInit, OnDestroy {
  itemsList: Localbeer[] = []
  properties: any
  filterList: Item[] = []
  editMode = true
  sortable = false;
  selected: number
  subscription: Subscription
  constructor(private service: DataService,
    private router: Router,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    private snackBar: MatSnackBar) { }

  ngOnInit() {
    this.subscription = this.route.parent.params.switchMap(val => {
      return this.service.getLocalCollection(val['client'])
    }).subscribe(val => this.itemsList = val)

    this.route.parent.params.pipe(
      switchMap(val => {
        return this.service.getBarProperties(val['client']).valueChanges().map(val => val.itemSettings)
      })).subscribe(val => {
        if (val)
          this.properties = val
        else {
          this.properties = {
            abv: true,
            ibu: true,
            type: true,
            price: true,
            description: true,
            local_description: true,
            location: true,
          }
        }
      })
  }

  onClick(item: number) {
    this.isSelected(item) ? this.selected = null : this.selected = item
  }

  isSelected(item: number) {
    if (this.selected != null)
      return this.selected == item
    return false
  }

  addBeer() {
    this.router.navigate(["../beers"], { relativeTo: this.route })
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.itemsList, event.previousIndex, event.currentIndex);
    let modList = this.itemsList
    modList.forEach(item => {
      delete item.beer
    })
    this.service.localFirestoreList.update({
      beerList: modList
    })
  }

  editBeer() {
    // this.service.selectedLocal = this.itemsList[this.selected]
    let input = this.itemsList[this.selected]
    const dialogRef = this.dialog.open(EditFormComponent, {
      width: '500px',
      disableClose: true,
      data: input
    });

    dialogRef.afterClosed()
      .subscribe((local) => {
        if (local) {
          let id = local.beer.id
          if (id) {
            let name = local.beer.withBrewery ? local.beer.brewery.name + " " + local.beer.name : local.beer.name
            local['beerID'] = id
            delete local.beer
            this.itemsList[this.selected] = local
            let localList = this.itemsList
            localList.forEach(item => delete item.beer)
            this.service.localFirestoreList.update({
              beerList: localList
            })
              .then(ref => {
                this.snackBar.open(name + " has been edited", "OK", {
                  duration: 3000,
                })
              })
          } else {
            this.snackBar.open("Beer could not be found, please add to the Beer List before sending this item to your local menu", "OK", {
              // duration: 3000,
            })
          }
          this.onClick(this.selected)
        }
      })
  }

  getSoldOutState() {
    if (this.selected!=null)
      if (this.itemsList[this.selected].soldOut)
        return "Bring On"

    return "Sold Out"
  }

  soldOutBeer() {
    if (this.selected!=null) {
      this.itemsList[this.selected].soldOut = !this.itemsList[this.selected].soldOut
      this.service.localFirestoreList.update({ beerList: this.itemsList })
    }
  }

  removeBeer() {
    if (confirm("Are you sure you want to delete this Menu Item?") == true) {
      console.log(this.itemsList[this.selected])
      let obj = Object.assign({}, this.itemsList[this.selected])
      delete obj.beer
      this.service.localFirestoreList.update({
        beerList: firestore.FieldValue.arrayRemove(obj)
      })
      this.selected = null
    }
  }

  clearSelect() {
    this.selected!=null ? this.selected = null : null
  }

  changeViewProperties() {
    const dialogRef = this.dialog.open(ViewFormComponent, {
      width: '550px',
      disableClose: true,
      data: this.properties
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.service.propertiesFirestoreList.update({
          // name: this.properties.name,
          itemSettings: result
        })
          .then(ref => {
            this.snackBar.open("View properties have been updated", "OK", {
              duration: 3000,
            })
          })
      }
    })
  }

  ngOnDestroy() {
    this.subscription.unsubscribe()
  }
}

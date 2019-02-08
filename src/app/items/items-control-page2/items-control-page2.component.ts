import { Component, OnInit } from '@angular/core';
import { Item } from '@shared/interfaces/item';
import * as _ from 'lodash'
import { DataService } from '@shared/services/data.service';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Localbeer } from '@shared/interfaces/localbeer';
import { ActivatedRoute, Router } from '@angular/router';
import { EditFormComponent } from './edit-form/edit-form.component';
import { MatDialog, MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-items-control-page2',
  templateUrl: './items-control-page2.component.html',
  styleUrls: ['./items-control-page2.component.css']
})
export class ItemsControlPage2Component implements OnInit {
  itemsList: Observable<Localbeer[]>
  filterList: Item[] = []
  editMode = true
  sortable = false;
  selected: Localbeer
  constructor(private service: DataService,
    private router: Router,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    private snackBar: MatSnackBar) { }

  ngOnInit() {
    this.itemsList = this.route.parent.params.pipe(
      switchMap(val => {
        return this.service.getLocalCollection(val['client'])
      }))
  }

  onClick(item: Localbeer) {
    this.isSelected(item) ? this.selected = null : this.selected = item
  }

  isSelected(item: Localbeer) {
    if (this.selected)
      return this.selected.id == item.id
    return false
  }

  addBeer() {
    this.router.navigate(["../beers"], { relativeTo: this.route })
  }

  editBeer() {
    console.log('EDIT - ' + this.selected.beer.name)
    this.service.selectedLocal = this.selected
    const dialogRef = this.dialog.open(EditFormComponent, {
      width: '500px',
      disableClose: true,
      data: this.selected
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        let local: Localbeer
        local = Object.assign({}, result)
        let name = local.beer.withBrewery ? local.beer.brewery.name + " " + local.beer.name : local.beer.name
        let key = local.id
        delete local.id
        delete local.beer
        this.service.localFirestoreList.doc(key).update(local)
          .then(ref => {
            this.snackBar.open(name + " has been edited", "OK", {
              duration: 2000,
            })
          })

        this.onClick(this.selected)
      }
    })
  }

  getSoldOutState() {
    if (this.selected.soldOut)
      if (this.selected.soldOut)
        return "Bring On"

    return "Sold Out"
  }

  soldOutBeer() {
    if (this.selected.soldOut)
      this.service.localFirestoreList.doc(this.selected.id).update({
        soldOut: false
      })
    else
      this.service.localFirestoreList.doc(this.selected.id).update({
        soldOut: true
      })
    this.selected.soldOut=!this.selected.soldOut
  }

  removeBeer() {
    if (confirm("Are you sure you want to delete this Menu Item?") == true)
      this.service.localFirestoreList.doc(this.selected.id).delete()
  }
  // applySort() {
  //   if (this.itemService.sortProperty == 'order')
  //     this.sortable = true
  //   else this.sortable = false

  //   if (this.itemService.sortOrder == 'desc')
  //     this.filterList = _.sortBy(this.itemsList, [this.itemService.sortProperty]).reverse()
  //   else
  //     this.filterList = _.sortBy(this.itemsList, [this.itemService.sortProperty])
  // }

  // sortProperty(property: string, order: string) {
  //   this.itemService.sortProperty = property
  //   this.itemService.sortOrder = order
  //   this.applySort()
  // }

  // onInsertBelow(obj: { item: Item }) {
  //   this.itemService.selectedItemList = this.itemsList
  //   this.itemService.selectedItem.order = obj.item.order + 1;
  //   this.itemService.showItemForm = true
  // }

  // onEdit(obj: { item: Item }) {
  //   this.itemService.selectedItem = Object.assign({}, obj.item)
  //   this.itemService.showItemForm = true
  // }

  // onDelete(obj: { item: Item }) {
  //   this.itemService.selectedItemList = this.itemsList
  //   this.itemService.deleteItem(obj.item)
  // }

  // onShiftUp(obj: { item: Item }) {
  //   this.itemService.selectedItemList = this.itemsList
  //   this.itemService.shiftItemUp(obj.item)
  // }

  // onShiftDown(obj: { item: Item }) {
  //   this.itemService.selectedItemList = this.itemsList
  //   this.itemService.shiftItemDown(obj.item)
  // }

  // onOut(obj: { item: Item }) {
  //   this.itemService.setItemOut(obj.item)
  // }

  // onIconOff(obj: { company: string, filename: string }) {
  //   this.itemService.setMissingIcon(obj.company, obj.filename)
  // }

  // saveSort() {
  //   this.itemService.saveSort()
  // }
}

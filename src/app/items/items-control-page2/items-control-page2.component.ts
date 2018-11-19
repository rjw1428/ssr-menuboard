import { Component, OnInit } from '@angular/core';
import { ItemsService } from '@shared/services/items.service';
import { Item } from '@shared/interfaces/item';
import * as _ from 'lodash'

@Component({
  selector: 'app-items-control-page2',
  templateUrl: './items-control-page2.component.html',
  styleUrls: ['./items-control-page2.component.css']
})
export class ItemsControlPage2Component implements OnInit {
  itemsList: Item[] = []
  filterList: Item[] = []
  editMode = true
  sortable = false;
  constructor(public itemService: ItemsService) { }

  ngOnInit() {
    this.itemService.getItems().snapshotChanges().subscribe(list => {
      this.itemsList = []
      list.map((items) => {
        if (items.key != 'sort') {
          let x = items.payload.toJSON() as Item
          x['key'] = items.key
          x['lastModified'] = String(new Date(x['lastModified']).getTime())
          this.itemsList.push(x)
        } else {
          let y = items.payload.toJSON() as { value: string, order: string }
          this.itemService.sortProperty = y.value
          this.itemService.sortOrder = y.order
        }
      })
      this.applySort()
    })
  }

  applySort() {
    if (this.itemService.sortProperty == 'order')
      this.sortable = true
    else this.sortable = false

    if (this.itemService.sortOrder == 'desc')
      this.filterList = _.sortBy(this.itemsList, [this.itemService.sortProperty]).reverse()
    else
      this.filterList = _.sortBy(this.itemsList, [this.itemService.sortProperty])
  }

  sortProperty(property: string, order: string) {
    this.itemService.sortProperty = property
    this.itemService.sortOrder = order
    this.applySort()
  }

  onInsertBelow(obj: { item: Item }) {
    this.itemService.selectedItemList = this.itemsList
    this.itemService.selectedItem.order = obj.item.order + 1;
    this.itemService.showItemForm = true
  }

  onEdit(obj: { item: Item }) {
    this.itemService.selectedItem = Object.assign({}, obj.item)
    this.itemService.showItemForm = true
  }

  onDelete(obj: { item: Item }) {
    this.itemService.selectedItemList = this.itemsList
    this.itemService.deleteItem(obj.item)
  }

  onShiftUp(obj: { item: Item }) {
    this.itemService.selectedItemList = this.itemsList
    this.itemService.shiftItemUp(obj.item)
  }

  onShiftDown(obj: { item: Item }) {
    this.itemService.selectedItemList = this.itemsList
    this.itemService.shiftItemDown(obj.item)
  }

  onOut(obj: { item: Item }) {
    this.itemService.setItemOut(obj.item)
  }

  onIconOff(obj: { company: string, filename: string }) {
    this.itemService.setMissingIcon(obj.company, obj.filename)
  }

  saveSort() {
    this.itemService.saveSort()
  }
}

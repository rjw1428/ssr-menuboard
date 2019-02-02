import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { ItemsService } from '@shared/services/items.service';
import { Item } from '@shared/interfaces/item';
import { trigger, transition, style, query, stagger, animate } from '@angular/animations';
import * as _ from 'lodash'

@Component({
  selector: 'app-items-display-page2',
  templateUrl: './items-display-page2.component.html',
  styleUrls: ['./items-display-page2.component.css'],
  animations: [
    // trigger('list1', [
    //   transition('* => *', [
    //     query(':enter', style({ transform: 'translateX(-100%)', opacity: 0 }), { optional: true }),
    //     query(':enter', stagger('100ms', [
    //       animate('500ms 700ms ease-in', style({ transform: 'translateX(0)', opacity: 1 }))
    //     ]), { optional: true }),
    //     query(':leave', style({ opacity: 1, }), { optional: true }),
    //     query(':leave', stagger('100ms', [
    //       animate('400ms ease-out', style({ transform: 'translateX(-100%)', opacity: 0, }))
    //     ]), { optional: true })
    //   ]),
    // ]),
    // trigger('list2', [
    //   transition('* => *', [
    //     query(':enter', style({ transform: 'translateX(100%)', opacity: 0 }), { optional: true }),
    //     query(':enter', stagger('100ms', [
    //       animate('500ms 700ms ease-in', style({ transform: 'translateX(0)', opacity: 1 }))
    //     ]), { optional: true }),
    //     query(':leave', style({ opacity: 1, transform: 'translateX(0)' }), { optional: true }),
    //     query(':leave', stagger('100ms', [
    //       animate('400ms ease-out', style({ opacity: 0, transform: 'translateX(100%)' }))
    //     ]), { optional: true })
    //   ]),
    // ]),
  ]
})
export class ItemsDisplayPage2Component implements OnInit {
  filterList: Item[]=[]
  leftList: Item[] = []
  rightList: Item[] = []
  iconList: any[] = []
  constructor(private itemsService: ItemsService) { }

  ngOnInit() {
    this.itemsService.getItems().snapshotChanges().subscribe(list => {
      let itemsList: Item[] = []
      this.leftList = []
      this.rightList = []
      list.map((items, index) => {
        if (items.key != 'sort') {
          let x = items.payload.toJSON() as Item
          x['key'] = items.key
          x['lastModified'] = String(new Date(x['lastModified']).getTime())
          let img = new Image()
          img.src = x.imgUrl
          this.iconList.push(img)
          itemsList.push(x)
        } else {
          let y = items.payload.toJSON() as {value: string}
          this.itemsService.sortProperty=y.value
        }
      })
      this.filterList=this.applySort(itemsList)
      this.brokerItems(this.filterList)
    })
  }

  applySort(list: Item[]) {
    if (this.itemsService.sortProperty == 'lastModified')
      return _.sortBy(list, [this.itemsService.sortProperty]).reverse()
    else
      return _.sortBy(list, [this.itemsService.sortProperty])
  }

  brokerItems(list: Item[]) {
    // console.log(list.length)
    // console.log(Math.ceil(list.length / 2))
    let count = 0
    list.forEach(item => {
      if (count < Math.ceil(list.length / 2))
        this.leftList.push(item)
      else
        this.rightList.push(item)
      count++
    })
    // console.log(this.leftList.length)
    // console.log(this.rightList.length)
  }
}

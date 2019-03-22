import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { Item } from '@shared/interfaces/item';
import { trigger, transition, style, query, stagger, animate } from '@angular/animations';
import * as _ from 'lodash'
import { Observable } from 'rxjs';
import { Localbeer } from '@shared/interfaces/localbeer';
import { DataService } from '@shared/services/data.service';
import { ActivatedRoute } from '@angular/router';
import { switchMap, map } from 'rxjs/operators';

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
  //filterList: Item[] = []
  leftList: Observable<Localbeer[]>
  rightList: Observable<Localbeer[]>
  properties: any
  constructor(private service: DataService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.params.pipe(
      switchMap(val => {
        return this.service.getBarProperties(val['client']).valueChanges().map(val => val.itemSettings)
      })).subscribe(val => {
        if (val) {
          this.properties = val
        }
        else {
          this.properties = {
            abv: true,
            ibu: true,
            type: true,
            price: true,
            description: true,
          }
        }
      })

    this.leftList = this.route.params.pipe(
      switchMap(val => {
        return this.service.getLocalCollection(val['client'])
      }),
      map((items: Localbeer[]) => {
        let max = Math.ceil(items.length / 2)
        return items.filter((v, i) => i < max)
      })
    )

    this.rightList = this.route.params.pipe(
      switchMap(val => {
        return this.service.getLocalCollection(val['client'])
      }),
      map((items: Localbeer[]) => {
        let max = Math.ceil(items.length / 2)
        return items.filter((v, i) => i >= max)
      })
    )
    // this.itemsList = this.route.params.pipe(
    //   switchMap(val => {
    //     return this.service.getLocalCollection(val['client'])
    //   })
    // )

    // this.itemsList.map(items => {
    //   this.leftList = this.itemsList.filter((beers, i) => {
    //     return i % 2 == 0
    //   })
    //   this.rightList = this.itemsList.filter((beer, i) => {
    //     return i % 2 == 1
    //   })
    //   console.log(this.leftList.map(list => {
    //     return `RIGHT: ${list.length}`
    //   }))
    //   console.log(this.rightList.map(list => {
    //     return `RIGHT: ${list.length}`
    //   }))
    // })
  }

  // applySort(list: Item[]) {
  //   if (this.itemsService.sortProperty == 'lastModified')
  //     return _.sortBy(list, [this.itemsService.sortProperty]).reverse()
  //   else
  //     return _.sortBy(list, [this.itemsService.sortProperty])
  // }
}

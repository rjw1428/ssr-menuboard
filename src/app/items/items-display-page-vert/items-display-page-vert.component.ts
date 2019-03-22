import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataService } from '@shared/services/data.service';
import { switchMap, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Localbeer } from '@shared/interfaces/localbeer';

@Component({
  selector: 'app-items-display-page-vert',
  templateUrl: './items-display-page-vert.component.html',
  styleUrls: ['./items-display-page-vert.component.css']
})
export class ItemsDisplayPageVertComponent implements OnInit {
  itemsList: Observable<Localbeer[]>
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

    this.itemsList = this.route.params.pipe(
      switchMap(val => {
        return this.service.getLocalCollection(val['client'])
      }),
      // map((items: Localbeer[]) => {
      //   let max = Math.ceil(items.length / 2)
      //   return items.filter((v, i) => i >= max)
      // })
    )
  }

}

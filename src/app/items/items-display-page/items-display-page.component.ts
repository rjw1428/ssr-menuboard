import { Component, OnInit, Input, Output, EventEmitter, OnDestroy, OnChanges } from '@angular/core';
import { Category } from '@shared/interfaces/category';
import { CategoryService } from '@shared/services/category.service';
import { trigger, state, style, transition, animate, query, stagger, keyframes } from '@angular/animations';
import 'rxjs/add/operator/map';

@Component({
  selector: 'app-items-display-page',
  templateUrl: './items-display-page.component.html',
  styleUrls: ['./items-display-page.component.css'],
  animations: [
    trigger('left', [
      transition(':enter', [
        style({ transform: 'translateX(-75vw)', opacity: 0 }),
        animate('1s cubic-bezier(.59, .1, 0.2, 1.5)',   //http://cubic-bezier.com
          style({ transform: 'translateX(0)', opacity: 1 }))
      ]),
      transition(':leave', [
        style({ opacity: 1, transform: 'translateX(0)', height: '*' }),
        animate('1s cubic-bezier(.46, -.62, 0.6, 1)',
          style({ opacity: 0, transform: 'translateX(-75vw)', height: '0px', marginTop: '0px', marginBottom: '0px' }))
      ])
    ]),
    trigger('right', [
      transition(':enter', [
        style({ transform: 'translateX(75vw)', opacity: 0 }),
        animate('1s cubic-bezier(.59, .1, 0.2, 1.5)',   //http://cubic-bezier.com
          style({ transform: 'translateX(0)', opacity: 1 }))
      ]),
      transition(':leave', [
        style({ opacity: 1, transform: 'translateX(0)', height: '*' }),
        animate('1s cubic-bezier(.46, -.62, 0.6, 1)',
          style({ opacity: 0, transform: 'translateX(75vw)', height: '0px', marginTop: '0px', marginBottom: '0px' }))
      ])
    ])
  ]
})

export class ItemsDisplayPageComponent implements OnInit, OnDestroy {
  @Output() displayComplete = new EventEmitter<{}>()
  @Output() columnComplete = new EventEmitter<{}>()
  @Input() delay = 5;
  editMode = false;
  leftList: Category[] = []
  rightList: Category[] = []
  leftComplete: boolean = false;
  rightComplete: boolean = false;
  center: boolean = false;
  interval: any
  constructor(private catService: CategoryService) {
  }

  ngOnInit() {
    this.catService.getCategories().snapshotChanges().subscribe(list => {
      this.leftList = [];
      this.rightList = [];
      list.map((category, index) => {
        let cat = category.payload.toJSON() as Category
        cat['key'] = category.key
        if (index % 2 == 0)
          this.leftList.push(cat)
        else this.rightList.push(cat)
      })
      this.rightList.sort((el1, el2) => el1.order - el2.order)
      this.leftList.sort((el1, el2) => el1.order - el2.order)

      if (this.leftList.length > this.rightList.length)
        this.center = true;
      else this.center = false;
    })

    this.interval=setInterval(() => {
      this.leftList.splice(0, 1);
      this.rightList.splice(0, 1);
      this.columnComplete.emit();
      if (!this.leftList.length && !this.rightList.length)
        this.displayComplete.emit();
    }, 1000 * this.delay)
  }

  ngOnDestroy() {
    console.log("ITEMS COMPLETE")
    if (this.interval)
      clearInterval(this.interval)
  }
}

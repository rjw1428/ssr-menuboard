import { Component, Output, EventEmitter, Input, OnChanges, OnInit, ElementRef, OnDestroy, HostListener } from '@angular/core';
import { ItemsService } from '@shared/services/items.service';
import { Item } from '@shared/interfaces/item';
import { Category } from '@shared/interfaces/category';
import { CategoryService } from '@shared/services/category.service';
import { ManagementService } from '@shared/services/management.service';

@Component({
  selector: 'app-item-category',
  templateUrl: './item-category.component.html',
  styleUrls: ['./item-category.component.css'],
  animations: [
  ]
})
export class ItemCategoryComponent implements OnInit {
  @Input() category: Category = new Category
  @Input() index: number
  @Input() editMode: boolean = false
  @Input() centerFlag: boolean = false
  @Output() displayComplete = new EventEmitter<{}>()
  @Output() delete = new EventEmitter<{ category: Category }>()
  @Output() shiftUp = new EventEmitter<{ category: Category }>()
  @Output() shiftDown = new EventEmitter<{ category: Category }>()
  @HostListener('window:resize', ['$event'])
  onResize(event?) {
    this.screenWidth = window.innerWidth;
  }
  screenWidth: number
  itemList: Item[] = [];
  menuToggle: boolean = false;
  constructor(
    public ms: ManagementService,
    public itemService: ItemsService,
    public catService: CategoryService) {
    this.onResize();
  }

  ngOnInit() {
    this.itemService.getData(this.category.key).snapshotChanges().subscribe(items => {
      this.itemList = [];
      items.forEach(element => {
        var y = element.payload.toJSON() as Item;
        if (element.key != 'order' && element.key != 'title' && element.key != 'lastModified') {
          y['key'] = element.key;
          this.itemList.push(y);
        }
      })
      this.itemList.sort((el1, el2) => el1.order - el2.order)
    })
  }

  onAddItem() {
    this.itemService.selectedCategory = this.category;
    this.itemService.selectedItemList = this.itemList
    this.itemService.selectedItem = {
      key: null,
      order: this.itemList.length + 1,
      company: '',
      beer: '',
      note: '',
      abv: '',
      imgUrl: '',
      available: true,
      happyHour: false,
      lastModified: ''
    }
    this.itemService.showItemForm = true
  }

  onEditCategory() {
    this.catService.selectedCategory = Object.assign({}, this.category);
    this.catService.showCategoryForm = true
  }

  onDeleteCategory() {
    if (confirm("Are you sure you want to delete this entire category? All items within this category will be removed!") == true)
      this.delete.emit({ category: this.category })
  }

  onUpCategory() {
    this.shiftUp.emit({ category: this.category })
  }

  onDownCategory() {
    this.shiftDown.emit({ category: this.category })
  }

  onInsertBelow(obj: { item: Item }) {
    this.itemService.selectedCategory = this.category;
    this.itemService.selectedItemList = this.itemList
    this.itemService.selectedItem.order = obj.item.order + 1;
    this.itemService.showItemForm = true
  }

  onEdit(obj: { item: Item }) {
    this.itemService.selectedCategory = this.category
    this.itemService.selectedItem = Object.assign({}, obj.item)
    this.itemService.showItemForm = true
  }

  onDelete(obj: { item: Item }) {
    this.itemService.selectedCategory = this.category
    this.itemService.selectedItemList = this.itemList
    this.itemService.deleteItemByCategory(obj.item)
  }

  onShiftUp(obj: { item: Item }) {
    this.itemService.selectedCategory = this.category
    this.itemService.selectedItemList = this.itemList
    this.itemService.shiftItemUpByCategory(obj.item)
  }

  onShiftDown(obj: { item: Item }) {
    this.itemService.selectedCategory = this.category
    this.itemService.selectedItemList = this.itemList
    this.itemService.shiftItemDownByCategory(obj.item)
  }

  onOut(obj: { item: Item }) {
    this.itemService.selectedCategory = this.category
    this.itemService.setItemOutByCategory(obj.item)
  }

  onIconOff(obj: { company: string, filename: string}) {
    this.itemService.setMissingIcon(obj.company, obj.filename)
  }

  onClick() {
    this.menuToggle == false ? this.menuToggle = true : this.menuToggle = false;
  }

  setTitleStyle() {
    let style = {
      'color': this.ms.headerFontColor.value,
      'font-size': this.screenWidth<=750? +this.ms.headerFontSize.value/1.5 + 'px':this.ms.headerFontSize.value + 'px',
      'font-family': this.ms.headerFont.value,
      'text-shadow': this.ms.headerTextShadow.value,
      // 'text-align': this.ms.headerAlignment.value,
    }
    return style
  }

  setColumnStyle() {
    let style = {
      'background-color': this.ms.headerBackColor.value,
      'border': this.ms.headerBorder.value,
      'border-radius': this.ms.headerBorderRadius.value + 'px',
      'box-shadow': this.ms.headerShadow.value,
    }
    return style
  }
}

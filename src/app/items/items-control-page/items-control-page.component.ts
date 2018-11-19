import { Component, OnInit, OnChanges } from '@angular/core';
import { Category } from '@shared/interfaces/category';
import { CategoryService } from '@shared/services/category.service';
import { ItemsService } from '@shared/services/items.service';

@Component({
  selector: 'app-items-control-page',
  templateUrl: './items-control-page.component.html',
  styleUrls: ['./items-control-page.component.css']
})
export class ItemsControlPageComponent implements OnInit {
  categoryList: Category[] = [];
  count: number;
  editMode = true;
  constructor(public itemService: ItemsService, public catService: CategoryService) {
  }

  ngOnInit() {
    this.catService.getCategories().snapshotChanges().subscribe(category => {
      this.categoryList = [];
      category.forEach(element => {
        let y = element.payload.toJSON() as Category;
        y['key'] = element.key;
        this.categoryList.push(y)
      });
      this.categoryList.sort((el1, el2) => el1.order - el2.order)
    })
  }

  onShiftUp(obj: { category: Category }) {
    let index = obj.category.order - 1
    if (index > 0) {
      let neighbor = this.categoryList[index - 1]
      this.catService.swapCategoryOrder(neighbor, obj.category)
    }
  }

  onShiftDown(obj: { category: Category }) {
    let index = obj.category.order - 1
    if (index < this.categoryList.length - 1) {
      let neighbor = this.categoryList[index + 1]
      this.catService.swapCategoryOrder(obj.category, neighbor)
    }
  }
  addCategory() {
    this.catService.selectedCategory = {
      order: this.categoryList.length + 1,
      key: null,
      title: null,
      lastModified: null
    }
    this.catService.showCategoryForm = true
  }

  deleteCategory(obj: { category: Category }) {
    this.catService.selectedCategoryList = this.categoryList
    this.catService.removeCategory(obj.category)
  }
}

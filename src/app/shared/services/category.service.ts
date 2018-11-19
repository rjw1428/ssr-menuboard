import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { Category } from '@shared/interfaces/category';
import { Item } from '@shared/interfaces/item';

@Injectable()
export class CategoryService {
  selectedCategory: Category = new Category();
  selectedCategoryList: Category[] = []
  showCategoryForm: boolean = false;
  activeCatGroup: number=0;
  constructor(private firebaseData: AngularFireDatabase) { }

  getCategories() {
    return this.firebaseData.list('menuListByCategory', ref => ref.orderByChild('order'))
  }

  insertCategory(category: Category): string {
    let newCat = this.firebaseData.list('menuList/').push({
      order: category.order,
      title: category.title,
      lastModified: this.timestamp()
    })
    return newCat.key;
  }

  removeCategory(category: Category) {
    this.selectedCategoryList.forEach(cat => {
      if (cat.order > category.order) {
        this.firebaseData.list('menuList/').update(cat.key, {
          order: cat.order - 1
        })
      }
    })
    this.firebaseData.list('menuList/' + category.key).remove()
  }

  editCategory(category: Category) {
    this.firebaseData.list('menuList/').update(category.key, {
      title: category.title,
      lastModified: this.timestamp()
    })
  }

  swapCategoryOrder(lowerCat: Category, upperCat: Category) {
    this.firebaseData.list('menuList/').update(lowerCat.key, {
      order: lowerCat.order + 1
    })
    this.firebaseData.list('menuList/').update(upperCat.key, {
      order: upperCat.order - 1
    })
  }

  timestamp() {
    return new Date().toLocaleString('en-US', { timeZone: 'America/New_York' })
  }
}

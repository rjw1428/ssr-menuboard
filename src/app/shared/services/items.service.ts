import { Injectable } from '@angular/core';
import { AngularFireDatabase, PathReference } from '@angular/fire/database';
import { Item } from '@shared/interfaces/item';
import { Category } from '@shared/interfaces/category';

@Injectable()
export class ItemsService {
  selectedItem: Item = new Item();
  selectedItemList: Item[] = [];
  selectedCategory: Category = new Category();
  showItemForm: boolean = false;
  itemCount: number[] = []
  sortProperty: string
  sortOrder: string
  constructor(private firebaseData: AngularFireDatabase) {
  }

  getData(category: String) {
    return this.firebaseData.list('menuListByCategory/' + <PathReference>category, ref => ref.orderByChild('order'))
  }

  getItems() {
    return this.firebaseData.list('menuList/', ref => ref.orderByChild('order'))
  }

  insertItemByCategory(item: Item) {
    if (item.order == undefined)
      item.order = 1;
    item.lastModified = this.timestamp();
    this.firebaseData.list('menuListByCategory/' + this.selectedCategory.key).push(item);
    this.selectedItemList.forEach(listItem => {
      if (listItem.order >= item.order) {
        this.firebaseData.list('menuListByCategory/' + this.selectedCategory.key).update(listItem.key, {
          order: listItem.order + 1
        })
      }
    })
  }

  deleteItemByCategory(item: Item) {
    this.firebaseData.list('menuList/' + this.selectedCategory.key).remove(item.key);
    this.selectedItemList.forEach(listItem => {
      if (listItem.order > item.order) {
        this.firebaseData.list('menuList/' + this.selectedCategory.key).update(listItem.key, {
          order: listItem.order - 1
        })
      }
    })
  }

  updateItemByCategory(item: Item) {
    this.firebaseData.list('menuList/' + this.selectedCategory.key).update(item.key,
      {
        company: item.company,
        order: item.order,
        beer: item.beer,
        note: item.note,
        abv: item.abv,
        imgUrl: item.imgUrl,
        available: item.available,
        happyHour: item.happyHour,
        lastModified: this.timestamp()
      });
  }

  setItemOutByCategory(item: Item) {
    this.firebaseData.list('menuList/' + this.selectedCategory.key).update(item.key,
      {
        available: !item.available,
        lastModified: this.timestamp()
      });
  }

  setMissingIcon(company: string, filename: string) {
    this.firebaseData.list('error/').push({
      company: company,
      filename: filename,
      timestamp: this.timestamp()
    })
  }

  shiftItemDownByCategory(item: Item) {
    if (item.order < this.selectedItemList.length) {
      let current_index = item.order - 1
      let nextItem = this.selectedItemList[current_index + 1] as Item
      this.firebaseData.list('menuList/' + this.selectedCategory.key).update(item.key, {
        order: item.order + 1,
      })
      this.firebaseData.list('menuList/' + this.selectedCategory.key).update(nextItem.key, {
        order: nextItem.order - 1,
      })
    }
  }
  shiftItemUpByCategory(item: Item) {
    if (item.order > 1) {
      let current_index = item.order - 1
      let nextItem = this.selectedItemList[current_index - 1] as Item
      this.firebaseData.list('menuList/' + this.selectedCategory.key).update(item.key, {
        order: item.order - 1,
      })
      this.firebaseData.list('menuList/' + this.selectedCategory.key).update(nextItem.key, {
        order: nextItem.order + 1,
      })
    }
  }

  insertItem(item: Item) {
    if (item.order == undefined)
      item.order = 1;
    item.lastModified = this.timestamp();
    this.firebaseData.list('menuList/').push(item);
    this.selectedItemList.forEach(listItem => {
      if (listItem.order >= item.order) {
        this.firebaseData.list('menuList/').update(listItem.key, {
          order: listItem.order + 1
        })
      }
    })
  }

  deleteItem(item: Item) {
    this.firebaseData.list('menuList/').remove(item.key);
    this.selectedItemList.forEach(listItem => {
      if (listItem.order > item.order) {
        this.firebaseData.list('menuList/').update(listItem.key, {
          order: listItem.order - 1
        })
      }
    })
  }

  updateItem(item: Item) {
    this.firebaseData.list('menuList/').update(item.key,
      {
        company: item.company,
        order: item.order,
        beer: item.beer,
        note: item.note,
        abv: item.abv,
        imgUrl: item.imgUrl,
        available: item.available,
        happyHour: item.happyHour,
        lastModified: this.timestamp()
      });
  }

  setItemOut(item: Item) {
    this.firebaseData.list('menuList/').update(item.key,
      {
        available: !item.available,
        lastModified: this.timestamp()
      });
  }

  shiftItemDown(item: Item) {
    if (item.order < this.selectedItemList.length) {
      let current_index = item.order - 1
      let nextItem = this.selectedItemList[current_index + 1] as Item
      this.firebaseData.list('menuList/').update(item.key, {
        order: item.order + 1,
      })
      this.firebaseData.list('menuList/').update(nextItem.key, {
        order: nextItem.order - 1,
      })
    }
  }
  shiftItemUp(item: Item) {
    if (item.order > 1) {
      let current_index = item.order - 1
      let nextItem = this.selectedItemList[current_index - 1] as Item
      this.firebaseData.list('menuList/').update(item.key, {
        order: item.order - 1,
      })
      this.firebaseData.list('menuList/').update(nextItem.key, {
        order: nextItem.order + 1,
      })
    }
  }

  saveSort() {
    console.log(this.sortProperty)
    console.log(this.sortOrder)
    this.firebaseData.list('menuList/').update('sort', {
      value: this.sortProperty,
      order: this.sortOrder
    })
  }

  timestamp() {
    return new Date().toLocaleString('en-US', { timeZone: 'America/New_York' })
  }
}


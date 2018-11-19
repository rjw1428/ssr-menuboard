import { Component, OnInit } from '@angular/core';
import { ItemsService } from '@shared/services/items.service';
import { NgForm } from '@angular/forms';
import { Item } from '@shared/interfaces/item';
import { IconNamePipe } from '@shared/pipes/icon-name.pipe';

@Component({
  selector: 'app-item-form',
  templateUrl: './item-form.component.html',
  styleUrls: ['./item-form.component.css']
})
export class ItemFormComponent implements OnInit {
  imageName = new IconNamePipe();
  focusCompany = true
  focusBeer = false
  focusDescription = false
  focusAbv = false
  constructor(public itemService: ItemsService) { }

  ngOnInit() {
  }

  onClose() {
    this.itemService.selectedCategory = null;
    this.itemService.showItemForm = false;
    this.itemService.selectedItem = {
      key: null,
      order: null,
      company: '',
      beer: '',
      note: '',
      abv: '',
      imgUrl: '',
      available: true,
      happyHour: false,
      lastModified: ''
    }
  }

  onSubmit(form: NgForm) {
    // console.log(form.value.beer)
    form.value.imgUrl = this.imageName.transform(form.value.company + "<>" + form.value.beer)
    form.value.available = true;
    if (form.value.abv == null)
      form.value.abv = '';
    if (form.value.happyHour != true)
      form.value.happyHour = false;
    if (form.value.key == null) {
      //NEW VALUE
      var newItem: Item = {
        key: null,
        order: form.value.order,
        company: form.value.company,
        beer: form.value.beer,
        note: form.value.note,
        abv: form.value.abv,
        imgUrl: form.value.imgUrl,
        available: true,
        happyHour: form.value.happyHour,
        lastModified: ''
      }
      console.log(newItem.beer)
      // this.itemService.insertItemByCategory(newItem)
      this.itemService.insertItem(newItem)
      this.onClose()
    }
    else {
      //EDIT VALUE
      // this.itemService.updateItemByCategory(form.value);
      this.itemService.updateItem(form.value);
      this.onClose()
    }
    this.resetForm(form);
  }

  resetForm(form?: NgForm) {
    this.itemService.selectedItem = {
      key: null,
      order: null,
      company: '',
      beer: '',
      note: '',
      abv: '',
      imgUrl: '',
      available: true,
      happyHour: false,
      lastModified: ''
    }
    if (form != null)
      form.reset();
  }
  onSelect(word: string) {
    console.log(word)
    this.setStyle(word)
  }

  setStyle(word: string) {
    if (word == 'company') {
      this.focusCompany = true
      this.focusBeer = false
      this.focusDescription = false
      this.focusAbv = false
    }
    else if (word == 'beer') {
      this.focusCompany = false
      this.focusBeer = true
      this.focusDescription = false
      this.focusAbv = false
    }
    else if (word == 'desc') {
      this.focusCompany = false
      this.focusBeer = false
      this.focusDescription = true
      this.focusAbv = false
    }
    else if (word == 'abv') {
      this.focusCompany = false
      this.focusBeer = false
      this.focusDescription = false
      this.focusAbv = true
    }
  }
}

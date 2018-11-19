import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Category } from '@shared/interfaces/category';
import { CategoryService } from '@shared/services/category.service';

@Component({
  selector: 'app-item-category-form',
  templateUrl: './item-category-form.component.html',
  styleUrls: ['./item-category-form.component.css']
})
export class ItemCategoryFormComponent implements OnInit {

  constructor(public catService: CategoryService) { }

  ngOnInit() {
  }

  onClose() {
    this.catService.showCategoryForm = false;
  }

  onSubmit(form: NgForm) {
    if (form.value.key == null) {
      //NEW VALUE
      var newCategory: Category = {
        key: null,
        order: form.value.order,
        title: form.value.title,
        lastModified: null
      }
      this.catService.insertCategory(newCategory)
      this.onClose()
    }
    else {
      //EDIT VALUE
      this.catService.editCategory(form.value);
      this.onClose()
    }
    this.resetForm(form);
  }

  resetForm(form?: NgForm) {
    this.catService.selectedCategory = new Category()
  }
}

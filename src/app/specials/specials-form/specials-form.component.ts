import { Component, OnInit } from '@angular/core';
import { SpecialsService } from '@shared/services/specials.service';
import { NgForm } from '@angular/forms';
import { Specials } from '@shared/interfaces/specials';

@Component({
  selector: 'app-specials-form',
  templateUrl: './specials-form.component.html',
  styleUrls: ['./specials-form.component.css']
})
export class SpecialsFormComponent implements OnInit {

  constructor(public specialsService: SpecialsService) { }

  ngOnInit() {
  }

  onClose() {
    this.specialsService.editMode = false
  }

  onSubmit(form: NgForm) {
    if (form.value.key==null) {
      //NEW VALUE
      var newSpecial: Specials = {
        key: null,
        order: form.value.order,
        title: form.value.title,
        note: form.value.note,
        lastModified: ''
      }
      this.specialsService.insert(newSpecial)
      this.onClose()
    
    } else {
      //EDIT VALUE
      this.specialsService.edit(form.value)
      this.onClose()
    }
    this.resetForm();
  }

  resetForm() {
    this.specialsService.specialSelected=new Specials()
  }
}

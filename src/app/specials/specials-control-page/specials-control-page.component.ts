import { Component, OnInit } from '@angular/core';
import { SpecialsService } from '@shared/services/specials.service';
import { Specials } from '@shared/interfaces/specials';
import {Observable} from 'rxjs/Rx';

@Component({
  selector: 'app-specials-control-page',
  templateUrl: './specials-control-page.component.html',
  styleUrls: ['./specials-control-page.component.css']
})
export class SpecialsControlPageComponent implements OnInit {
  specialsList: Specials[] = []
  constructor(public specialsService: SpecialsService) {
    let observable = this.specialsService.getSpecials().snapshotChanges().map(specials => {
      let list = [];
      this.specialsList = [];
      specials.map(element => {
        var y = element.payload.toJSON();
        y['key'] = element.key
        list.push(y as Specials)
      })
      list.sort((el1, el2) => el1.order - el2.order)
      return list
    })
    observable.forEach((val) => {
      val.map((el: Specials) => this.specialsList.push(el))
    })
  }

  ngOnInit() {

  }
  onAdd() {
    this.specialsService.specialSelected = Object.assign({}, {key: null, order: 1, title: null, note: null, lastModified: null} as Specials)
    this.specialsService.editMode=true
  }

  onInsert(obj: { special: Specials }) {
    this.specialsService.specialSelected = Object.assign({}, {key: null, order: obj.special.order+1, title: null, note: null, lastModified: null} as Specials)
    this.specialsService.editMode=true
    this.specialsService.specialsList = this.specialsList
  }

  onEdit(obj: { special: Specials }) {
    this.specialsService.specialSelected = Object.assign({}, obj.special)
    this.specialsService.editMode=true
    this.specialsService.specialsList = this.specialsList
    this.specialsService.edit(obj.special)
  }

  onRemove(obj: { special: Specials }) {
    this.specialsService.specialsList = this.specialsList
    this.specialsService.remove(obj.special)
  }

  onShiftUp(obj: { special: Specials }) {
    this.specialsService.specialsList = this.specialsList
    this.specialsService.shiftUp(obj.special)
  }

  onShiftDown(obj: { special: Specials }) {
    this.specialsService.shiftDown(obj.special)
    this.specialsService.specialsList = this.specialsList
  }
}

import { Component, OnInit } from '@angular/core';
import { Item } from '@shared/interfaces/item';
import { ManagementService } from '@shared/services/management.service';

@Component({
  selector: 'app-item-properties',
  templateUrl: './item-properties.component.html',
  styleUrls: ['./item-properties.component.css']
})
export class ItemPropertiesComponent implements OnInit {
  testItem: Item = {
    key: null,
    company: "Company Name",
    beer: "and Beer",
    note: "Item description",
    abv: '5.0',
    imgUrl: 'default',
    order: 1,
    available: true,
    happyHour: false,
    lastModified: null
  }

  titleProperties = {
    font: null,
    textShadow: null,
    color: null,
    letterSpacing: null,
    emphasis: null
  }

  properties: {
    description: {
      font: null,
      textShadow: null,
      color: null,
      letterSpacing: null,
      emphasis: null
    },
    abv: {
      font: null,
      textShadow: null,
      color: null,
      letterSpacing: null,
      emphasis: null,
      marginRight: null,
    },
    icon: {
      size: null,
      defaultIcon: null,
    },
    background: {
      backgroundColor: null,
      border: null,
      borderRadius: null,
      boxShadow: null,
    }
  }


  constructor(public ms: ManagementService) {

  }
  ngOnInit() {
  }
}

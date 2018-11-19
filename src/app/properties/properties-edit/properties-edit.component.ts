import { Component, OnInit } from '@angular/core';
import { ManagementService } from '@shared/services/management.service';
import { Property } from '@shared/interfaces/property';

@Component({
  selector: 'app-properties-edit',
  templateUrl: './properties-edit.component.html',
  styleUrls: ['./properties-edit.component.css']
})
export class PropertiesEditComponent implements OnInit {
  propertyList = []
  constructor(public ms: ManagementService) { }

  ngOnInit() {
    this.ms.getProperties().snapshotChanges().subscribe(properties => {
      this.propertyList = []
      properties.forEach(property => {
        if (property.key != "forceRefresh") {
          let x = property.payload.toJSON()
          x['key'] = property.key
          this.propertyList.push(x as Property)
        }
      })
    })
  }
}

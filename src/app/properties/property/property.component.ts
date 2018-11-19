import { Component, OnInit, Input } from '@angular/core';
import { Property } from '@shared/interfaces/property';
import { ManagementService } from '@shared/services/management.service';

@Component({
  selector: 'app-property',
  templateUrl: './property.component.html',
  styleUrls: ['./property.component.css']
})

export class PropertyComponent implements OnInit {
  @Input() property: Property
  @Input() index: number
  storeValue: Property=new Property();
  constructor(public ms: ManagementService) {
  }

  ngOnInit() {
    this.storeValue = Object.assign({}, this.property)
  }

  onSave() {
    this.storeValue.value.trim()
    this.ms.updateProperty(this.storeValue)
  }

  onCancel() {
    this.storeValue = Object.assign({}, this.property)
  }
}

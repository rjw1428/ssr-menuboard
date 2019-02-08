import { Component, OnInit, Input } from '@angular/core';
import { Brewery } from '@shared/interfaces/brewery';
import { AngularFireStorage } from '@angular/fire/storage';
import { environment } from '@environments/environment';
import { DataService } from '@shared/services/data.service';

@Component({
  selector: 'app-brewery',
  templateUrl: './brewery.component.html',
  styleUrls: ['./brewery.component.css']
})
export class BreweryComponent implements OnInit {
  @Input() brewery: Brewery
  @Input() selected: boolean
  location: string
  constructor(private storage: AngularFireStorage, private service: DataService) { }

  ngOnInit() {
    this.location = this.buildLocation()
  }

  isSelected() {
    if (!this.service.selectedBrewery)
      return false
    return this.service.selectedBrewery.name == this.brewery.name
  }

  onClick() {
    // if (this.service.selectedBrewery && this.service.selectedBrewery.name == this.brewery.name)
    //   this.service.selectedBrewery = null
    // else
    //   this.service.selectedBrewery = this.brewery
  }

  buildLocation() {
    if (this.brewery.city && this.brewery.state)
      return this.location = `${this.brewery.city}, ${this.brewery.state.substr(0, 2)}`
    if (this.brewery.city && this.brewery.country)
      return this.location = `${this.brewery.city}, ${this.brewery.country.substr(0, 2)}`
    return ''
  }
}

import { Component, OnInit, Input } from '@angular/core';
import { Beer } from '@shared/interfaces/beer';
import { environment } from '@environments/environment';
import { AngularFireStorage } from '@angular/fire/storage';
import { DataService } from '@shared/services/data.service';

@Component({
  selector: 'app-beer',
  templateUrl: './beer.component.html',
  styleUrls: ['./beer.component.css']
})
export class BeerComponent implements OnInit {
  @Input() beer: Beer;
  title: string
  displayIcon: string
  location: string
  @Input() selected: boolean
  constructor(private storage: AngularFireStorage, private service: DataService) { }

  ngOnInit() {
    this.title = this.beer.withBrewery ? this.beer.brewery.name + " " + this.beer.name : this.beer.name
    //this.displayIcon = this.beer.icon ? this.beer.icon : this.beer.brewery.iconLoc
    this.location = this.buildLocation()
    this.getIcon()
  }
  getIcon() {
    let refPath: string
    if (this.beer.icon)
      refPath = environment.itemIconRootAddress + this.beer.icon
    else refPath = environment.itemIconRootAddress + this.beer.brewery.icon
    this.storage.ref(refPath).getDownloadURL().toPromise()
      .then(value=>{
        console.log("GETTING ICONS")
        return value
      })
      .then(value => {
        this.displayIcon = value
      })
      .catch(e => {
        this.displayIcon = '../../../assets/404icon.png'
        this.service.logImageError(this.beer.brewery.icon)
      })
  }
  buildLocation() {
    if (this.beer.brewery.city && this.beer.brewery.state)
      return this.location = `${this.beer.brewery.city}, ${this.beer.brewery.state.substr(0, 2)}`
    if (this.beer.brewery.city && this.beer.brewery.country)
      return this.location = `${this.beer.brewery.city}, ${this.beer.brewery.country.substr(0, 2)}`
    return ''
  }

  onClick() {
    // if (this.selected) {
    //   this.selected = false
    // } else {
    //   this.selected = true
    // }
  }
}

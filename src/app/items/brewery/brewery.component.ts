import { Component, OnInit, Input } from '@angular/core';
import { Brewery } from '@shared/interfaces/brewery';
import { AngularFireStorage } from '@angular/fire/storage';
import { environment } from '@environments/environment';

@Component({
  selector: 'app-brewery',
  templateUrl: './brewery.component.html',
  styleUrls: ['./brewery.component.css']
})
export class BreweryComponent implements OnInit {
  @Input() brewery: Brewery
  icon: string
  constructor(private storage: AngularFireStorage) { }

  ngOnInit() {
    this.getImage(this.brewery.icon)
  }

  getImage(val: string) {
    if (val.substr(0, 4) != 'http')
      this.storage.ref(environment.itemIconRootAddress + val).getDownloadURL().toPromise()
        .then(value => {
          this.icon = value;
        })
        .catch(e => {
          this.icon = '../../../assets/404icon.png'
        })
    else this.icon = val
  }

}

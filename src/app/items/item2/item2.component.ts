import { Component, OnInit, Input, Output, EventEmitter, HostListener, AfterViewInit, OnChanges } from '@angular/core';
import { Item } from '@shared/interfaces/item';
import { AngularFireStorage } from '@angular/fire/storage';
import { environment } from '@environments/environment';
import { ManagementService } from '@shared/services/management.service';
import { Beer } from '@shared/interfaces/beer';
import { DataService } from '@shared/services/data.service';
import { Brewery } from '@shared/interfaces/brewery';
import { Localbeer } from '@shared/interfaces/localbeer';
import { ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-item2',
  templateUrl: './item2.component.html',
  styleUrls: ['./item2.component.scss'],
  animations: [
  ]
})

export class Item2Component implements OnInit {
  @Input() item: Localbeer;
  @Input() selected: boolean;
  @Input() displayProperties: any;
  @Input() edit: boolean = false;
  @HostListener('window:resize', ['$event'])
  onResize(event?) {
    this.screenWidth = window.innerWidth;
  }
  screenWidth: number
  // imgUrl: string;
  // menuToggle: boolean = false;
  title: string
  displayIcon: string
  location: string
  constructor(private storage: AngularFireStorage, private ms: ManagementService, private service: DataService, private route: ActivatedRoute) {
    this.onResize();
  }

  ngOnInit() {
    if (this.item.beer) {
      this.title = this.item.beer.withBrewery ? this.item.beer.brewery.name + " " + this.item.beer.name : this.item.beer.name
      this.location = this.buildLocation()
      this.getIcon()
    }
  }
  getIcon() {
    let refPath: string
    if (this.item.beer.icon)
      refPath = environment.itemIconRootAddress + this.item.beer.icon
    else refPath = environment.itemIconRootAddress + this.item.beer.brewery.icon

    this.storage.ref(refPath).getDownloadURL().toPromise()
      .then(value => {
        console.log("GETTING ICON")
        return value
      })
      .then(value => {
        this.displayIcon = value
      })
      .catch(e => {
        this.displayIcon = '../../../assets/404icon.png'
        this.service.logImageError(this.item.beer.brewery.icon)
      })
  }

  buildLocation() {
    if (this.item.beer.brewery.city && this.item.beer.brewery.state)
      return this.location = `${this.item.beer.brewery.city}, ${this.item.beer.brewery.state.substr(0, 2)}`
    if (this.item.beer.brewery.city && this.item.beer.brewery.country)
      return this.location = `${this.item.beer.brewery.city}, ${this.item.beer.brewery.country.substr(0, 2)}`
    return ''
  }

  // isSelected() {
  //   if (!this.service.selectedBeer)
  //     return false
  //   return this.service.selectedBeer.id == this.item.id
  // }

  test() {
    // console.log("item2 - Click")
  }

  onDelete() {
    //if (confirm("Are you sure you want to delete this Menu Item?") == true)
    //this.itemDeleted.emit({ item: this.item })
  }

  onAdd() {
    //this.itemAdded.emit({ item: this.item })
  }

  onEdit() {
    //this.itemEdited.emit({ item: this.item })
  }

  onShiftUp() {
    //this.itemShiftUp.emit({ item: this.item })
  }

  onShiftDown() {
    //this.itemShiftDown.emit({ item: this.item })
  }

  onOut() {
    //this.itemOut.emit({ item: this.item })
  }

  onClick() {
    //this.fixKey()
    //this.selected.emit(this.item)
    // if (this.service.selectedBeer && this.service.selectedBeer.id == this.item.id)
    //   this.service.selectedBeer = null
    // else
    //   this.service.selectedBeer = this.item.bee

    //this.service.selectedBeer = this.item
    //this.menuToggle == true ? this.menuToggle = false : this.menuToggle = true;
  }

  setTitleStyle() {
    let style = {
      // 'color': this.ms.itemTitleFontColor.value,
      // 'font-size': this.screenWidth <= 750 ? +this.ms.itemTitleFontSize.value / 2 + 'px' : this.ms.itemTitleFontSize.value + 'px',
      // 'font-family': this.ms.itemTitleFont.value,
      // 'text-shadow': this.ms.itemTitleShadow.value,
      // 'letter-spacing': this.ms.itemTitleLetterSpace.value + 'px',
    }
    return style
  }

  setNoteStyle() {
    let style = {
      // 'color': this.ms.itemNoteFontColor.value,
      // 'font-size': this.screenWidth <= 750 ? +this.ms.itemNoteFontSize.value / 2 + 'px' : this.ms.itemNoteFontSize.value + 'px',
      // 'font-family': this.ms.itemNoteFont.value,
      // 'text-shadow': this.ms.itemNoteShadow.value
    }
    return style
  }

  setIconStyle() {
    let style = {
      // 'width': this.screenWidth <= 750 ? +this.ms.iconSize.value / 2 + 'px' : this.ms.iconSize.value + 'px',
      // 'height': this.screenWidth <= 750 ? +this.ms.iconSize.value / 2 + 'px' : this.ms.iconSize.value + 'px',
    }
    return style
  }

  setAbvStyle() {
    let style = {
      // 'color': this.ms.itemAbvFontColor.value,
      // 'font-size': this.screenWidth <= 750 ? +this.ms.itemAbvFontSize.value / 2 + 'px' : this.ms.itemAbvFontSize.value + 'px',
      // 'font-family': this.ms.itemAbvFont.value,
      // 'text-shadow': this.ms.itemAbvShadow.value
    }
    return style
  }

  setElementStyle() {
    let style = {
      // 'border-collapse': 'separate !important',
      // 'background-color': this.ms.itemBackground.value,
      // 'border': this.ms.itemBorder.value,
      // 'border-radius': this.ms.itemBorderRadius.value + 'px',
      // 'box-shadow': this.ms.itemBoxShadow.value,
      // 'height': this.ms.itemBackgroundHeight.value+'px'
    }
    return style
  }

  setSoldOutStyle() {
    let style = {
      // 'color': this.ms.itemSoldOutFontColor.value,
      // 'font-size': this.screenWidth <= 750 ? +this.ms.itemSoldOutFontSize.value / 2 + 'px' : this.ms.itemSoldOutFontSize.value + 'px',
      // 'font-family': this.ms.itemSoldOutFont.value,
      // 'text-shadow': this.ms.itemSoldOutShadow.value
    }
    return style
  }

  setColumnStyle() {
    let style = {
      // 'grid-template-columns': this.screenWidth <= 750 ? +this.ms.iconSize.value / 2 + 'px auto' : this.ms.iconSize.value + 'px auto'
    }
    return style
  }

  // fixKey() {
  //   let x = this.item
  //   let hold = x.id
  //   delete x.id
  //   delete x.iconLoc
  //   delete x.brewery
  //   if (!x.icon)
  //     delete x.icon
  //   let id = x.masterBreweryKey + " " + x.name.toLowerCase()
  //   this.service.beerFirestoreList.doc(id).set(x)
  //   this.service.beerFirestoreList.doc(hold).delete()
  // }
}

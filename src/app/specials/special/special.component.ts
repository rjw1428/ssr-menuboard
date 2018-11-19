import { Component, OnInit, Input, Output, EventEmitter, HostListener } from '@angular/core';
import { Specials } from '@shared/interfaces/specials';
import { ManagementService } from '@shared/services/management.service';

@Component({
  selector: 'app-special',
  templateUrl: './special.component.html',
  styleUrls: ['./special.component.css']
})
export class SpecialComponent implements OnInit {
  @Input() special: Specials
  @Input() editable: boolean
  @Output() add = new EventEmitter<{ special: Specials }>()
  @Output() edit = new EventEmitter<{ special: Specials }>()
  @Output() remove = new EventEmitter<{ special: Specials }>()
  @Output() shiftUp = new EventEmitter<{ special: Specials }>()
  @Output() shiftDown = new EventEmitter<{ special: Specials }>()
  @HostListener('window:resize', ['$event'])
  onResize(event?) {
    this.screenWidth = window.innerWidth;
  }
  screenWidth: number
  menuOpen: boolean = false;

  constructor(public ms: ManagementService) { 
    this.onResize();
  }

  ngOnInit() {
  }

  onAdd() {
    this.add.emit({ special: this.special })
  }

  onEdit() {
    this.edit.emit({ special: this.special })
  }

  onDelete() {
    if (confirm("Are you sure you want to delete this Special Item?") == true)
      this.remove.emit({ special: this.special })
  }

  onShiftUp() {
    this.shiftUp.emit({ special: this.special })
  }

  onShiftDown() {
    this.shiftDown.emit({ special: this.special })
  }

  toggleMenu() {
    this.menuOpen == true ? this.menuOpen = false : this.menuOpen = true
  }

  setTitleStyle() {
    let style = {
      'color': this.ms.specialTitleColor.value,
      'font-size': this.screenWidth<=750? +this.ms.specialTitleSize.value*2/3 + 'px':this.ms.specialTitleSize.value + 'px',
      'font-family': this.ms.specialTitleFont.value,
    }
    return style

  }

  setDescStyle() {
    let style = {
      'color': this.ms.specialDescColor.value,
      'font-size': this.screenWidth<=750? +this.ms.specialDescSize.value*2/3 + 'px':this.ms.specialDescSize.value + 'px',
      'font-family': this.ms.specialDescFont.value,
    }
    return style
  }

  setBackground() {
    let style = {
      'background-color': this.ms.specialBackColor.value,
      'box-shadow': this.ms.specialBoxShadow.value,
    }
    return style
  }

  setBg() {
    let style = {
      'background-color': this.ms.specialBackColor.value,
      'border': this.ms.specialBorder.value,
      'border-radius': this.ms.specialBorderRadius.value + 'px'
    }
    return style
  }
}

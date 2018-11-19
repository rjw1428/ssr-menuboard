import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { FeaturesService } from '@shared/services/features.service';
import { FeaturedItem } from '@shared/interfaces/featured-item';
import { NgForm } from '@angular/forms';
import { MatButtonModule, MatCheckboxModule } from '@angular/material';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-feature-form',
  templateUrl: './feature-form.component.html',
  styleUrls: ['./feature-form.component.css']
})
export class FeatureFormComponent implements OnInit {
  @Output() formSubmitted = new EventEmitter<{ featured: FeaturedItem }>()
  @Output() formClosed = new EventEmitter<{}>()

  focusTitle = false
  focusCap = false
  focusSubCap = false
  focusImg = false
  focusStart = false
  focusEnd = false
  constructor(public featureService: FeaturesService) { }

  ngOnInit() {
  }

  onBack() {
    this.formClosed.emit()
  }

  onSubmit(form: NgForm) {
    if (form.value.key == null) {
      //NEW VALUE
      var newFeatured: FeaturedItem = {
        key: null,
        order: form.value.order,
        header: form.value.header,
        caption: form.value.caption,
        subcaption: form.value.subcaption,
        url: form.value.url,
        startDate: form.value.startDate,
        endDate: form.value.endDate,
        active: form.value.active,
        child: form.value.child,
        lastModified: form.value.lastModified,
        layout: form.value.layout
      }
      this.formSubmitted.emit({
        featured: newFeatured
      })
    } else {
      //EDIT VALUE
      this.featureService.updateFeatured(form.value);
    }
    this.formClosed.emit()
  }
  onSelect(word: string) {
    console.log(word)
    this.setStyle(word)
  }

  setStyle(word: string) {
    if (word == 'title') {
      this.focusTitle = true
      this.focusCap = false
      this.focusSubCap = false
      this.focusImg = false
      this.focusStart = false
      this.focusEnd = false
    }
    else if (word == 'cap') {
      this.focusTitle = false
      this.focusCap = true
      this.focusSubCap = false
      this.focusImg = false
      this.focusStart = false
      this.focusEnd = false
    }
    else if (word == 'subcap') {
      this.focusTitle = false
      this.focusCap = false
      this.focusSubCap = true
      this.focusImg = false
      this.focusStart = false
      this.focusEnd = false
    }
    else if (word == 'img') {
      this.focusTitle = false
      this.focusCap = false
      this.focusSubCap = false
      this.focusImg = true
      this.focusStart = false
      this.focusEnd = false
    }
    else if (word == 'start') {
      this.focusTitle = false
      this.focusCap = false
      this.focusSubCap = false
      this.focusImg = false
      this.focusStart = true
      this.focusEnd = false
    }
    else if (word == 'end') {
      this.focusTitle = false
      this.focusCap = false
      this.focusSubCap = false
      this.focusImg = false
      this.focusStart = false
      this.focusEnd = true
    }
  }
}

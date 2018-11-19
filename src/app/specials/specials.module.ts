import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SpecialsPageComponent } from '@specials/specials-page/specials-page.component';
import { SpecialComponent } from '@specials/special/special.component';
import { SpecialsService } from '@shared/services/specials.service';
import { SpecialsControlPageComponent } from './specials-control-page/specials-control-page.component';
import { SpecialsFormComponent } from './specials-form/specials-form.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    FormsModule
  ],
  declarations: [
    SpecialsPageComponent,
    SpecialComponent,
    SpecialsControlPageComponent,
    SpecialsFormComponent,

  ],
  providers: [
    SpecialsService
  ],
  exports: [
    SpecialsPageComponent,
    SpecialComponent,
    SpecialsControlPageComponent,
    SpecialsFormComponent,
  ]
})
export class SpecialsModule { }

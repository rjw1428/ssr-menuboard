import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavBarComponent } from './nav-bar.component';
import { ItemsControlPage2Component } from '@item/items-control-page2/items-control-page2.component';
import { SearchModule } from 'app/search/search.module';
import { SharedModule } from '@shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    SearchModule,
  ],
  declarations: [
    NavBarComponent,
    ItemsControlPage2Component,
  ]
})
export class EditModule { }

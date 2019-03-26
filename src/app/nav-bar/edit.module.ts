import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavBarComponent } from './nav-bar.component';
import { ItemsControlPage2Component } from '@item/items-control-page2/items-control-page2.component';
import { SearchModule } from 'app/search/search.module';
import { SharedModule } from '@shared/shared.module';
import { DragDropModule } from '@angular/cdk/drag-drop'
import { FeaturesControlPageComponent } from '@features/features-control-page/features-control-page.component';
import { ContentManagerComponent } from 'app/content-manager/content-manager.component';
import { UploadComponent } from 'app/content-manager/upload/upload.component';
import { UploadFormComponent } from 'app/content-manager/upload-form/upload-form.component';
import { ScreenControlComponent } from 'app/screen-control/screen-control.component';
import { PropertiesEditComponent } from 'app/properties/properties-edit/properties-edit.component';
import { SearchComponent } from 'app/search/beer-search/search.component';
import { BrewerySearchComponent } from 'app/search/brewery-search/brewery-search.component';
import { Routes, RouterModule } from '@angular/router';
import { SignupComponent } from '../auth/signup/signup.component';
import { ScreenComponent } from 'app/screen-control/screen/screen.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    SearchModule,
    DragDropModule,
  ],
  declarations: [
    NavBarComponent,
    ItemsControlPage2Component,
    ContentManagerComponent,
    UploadComponent,
    UploadFormComponent,
    ScreenControlComponent,
    ScreenComponent,
    SignupComponent
  ],
  entryComponents: [
    UploadFormComponent,
    SignupComponent
  ]
})
export class EditModule { }


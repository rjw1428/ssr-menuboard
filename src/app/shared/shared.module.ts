import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatInputModule, MatDialogModule, MatButtonModule, MatFormFieldModule, MatSelectModule, MatAutocompleteModule, MatSnackBarModule, MatIconModule, MatCheckboxModule } from '@angular/material';
import { ScrollDispatchModule } from '@angular/cdk/scrolling';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { UsernamePipe } from './pipes/username.pipe';
import { IconNamePipe } from './pipes/icon-name.pipe';
import { AbvPipe } from './pipes/abv.pipe';
import { TitlecasePipe } from './pipes/titlecase.pipe';
import { FeaturesModule } from '@features/features.module';
import { Item2Component } from '@item/item2/item2.component';
import { DataService } from './services/data.service';
import { RoutingModule } from 'app/routing/routing.module';
import { BrowserModule } from '@angular/platform-browser';
import { Feature2Component } from '@features/feature2/feature2.component';
import { ImgOrientationDirective } from './directives/img-orientation.directive';
import { ScreenOrientationDirective } from './directives/screen-orientation.directive';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatInputModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatAutocompleteModule,
    MatSnackBarModule,
    MatIconModule,
    MatCheckboxModule,
    ScrollDispatchModule,
    RoutingModule,
    BrowserModule,
  ],
  declarations: [
    UsernamePipe,
    IconNamePipe,
    AbvPipe,
    TitlecasePipe,
    Item2Component,
    Feature2Component,
    ImgOrientationDirective,
    ScreenOrientationDirective,
  ],
  exports: [
    UsernamePipe,
    IconNamePipe,
    AbvPipe,
    TitlecasePipe,
    Item2Component,
    Feature2Component,
    RoutingModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatInputModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatAutocompleteModule,
    MatSnackBarModule,
    MatAutocompleteModule,
    MatIconModule,
    MatCheckboxModule,
    ScrollDispatchModule,
  ],
  providers: [DataService]
})
export class SharedModule { }

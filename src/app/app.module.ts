import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { environment } from '@environments/environment';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AppComponent } from './app.component';

import { DisplayComponent } from './display/display.component';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { SigninComponent } from './auth/signin/signin.component'
import { SignupComponent } from './auth/signup/signup.component'
import { StaticComponent } from '@static/static.component';
import { ManagementService } from '@shared/services/management.service';

import { ItemsModule } from '@item/items.module';
import { FeaturesModule } from '@features/features.module';
import { SpecialsModule } from '@specials/specials.module';
import { SocialModule } from '@social/social.module';
import { DisplayModule } from './display/display.module';
import { RoutingModule } from './routing/routing.module';
import { PropertiesEditComponent } from './properties/properties-edit/properties-edit.component';
import { PropertyComponent } from './properties/property/property.component';
import { TimerComponent } from "@display/timer/timer.component";
import { ContentManagerComponent } from './content-manager/content-manager.component';
import { UploadComponent } from './content-manager/upload/upload.component';
import { PreloadDirective } from './shared/directives/preload.directive';
import { UsernamePipe } from '@shared/pipes/username.pipe';
import { TriviaModule } from '@trivia/trivia.module';
import { SinglePageComponent } from './display/single-page/single-page.component';
import { DemoComponent } from './display/single-page/demo/demo.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SlideDirective } from './shared/directives/slide.directive';
import { SearchComponent } from './search/beer-search/search.component';
import { Item2Component } from './items/item2/item2.component'
import { Items2Service } from '@shared/services/items2.service';
import { MatDialogModule } from '@angular/material/dialog'
import { DialogAddBeerDialog } from './search/beer-form/form.component';
import { MatFormFieldModule, MatButtonModule, MatInputModule, MatSelectModule, MatAutocompleteModule, MatSnackBarModule, MatIconModule } from '@angular/material';
import { DialogAddBreweryDialog } from './search/brewery-form/form.component';
import { BrewerySearchComponent } from './search/brewery-search/brewery-search.component';
import { BreweryComponent } from'./items/brewery/brewery.component';

@NgModule({
  declarations: [
    AppComponent,
    DisplayComponent,
    NavBarComponent,
    SigninComponent,
    SignupComponent,
    StaticComponent,
    PropertiesEditComponent,
    PropertyComponent,
    TimerComponent,
    ContentManagerComponent,
    UploadComponent,
    PreloadDirective,
    UsernamePipe,
    SinglePageComponent,
    DemoComponent,
    SlideDirective,
    Item2Component,
    DialogAddBreweryDialog,
    DialogAddBeerDialog,
    SearchComponent,
    BrewerySearchComponent,
    BreweryComponent
  ],
  imports: [
    BrowserModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule,
    AngularFireStorageModule,
    AngularFirestoreModule,
    BrowserAnimationsModule,
    FormsModule,
    RoutingModule,
    ReactiveFormsModule,
    ItemsModule,
    FeaturesModule,
    SpecialsModule,
    SocialModule,
    TriviaModule,
    NgbModule,
    MatInputModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatAutocompleteModule,
    MatSnackBarModule,
    MatAutocompleteModule,
    MatIconModule,
  ],
  entryComponents: [
    DialogAddBeerDialog,
    DialogAddBreweryDialog
  ],
  exports: [
  ],
  //providers: [ManagementService],
  providers: [ManagementService, Items2Service],
  bootstrap: [AppComponent]
})
export class AppModule { }

import { NgModule } from '@angular/core';

import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { environment } from '@environments/environment';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AppComponent } from './app.component';

import { SigninComponent } from './auth/signin/signin.component'
import { ManagementService } from '@shared/services/management.service';

import { SpecialsModule } from '@specials/specials.module';
import { SocialModule } from '@social/social.module';
import { DisplayModule } from './display/display.module';
import { PropertiesEditComponent } from './properties/properties-edit/properties-edit.component';
import { PropertyComponent } from './properties/property/property.component';
import { TimerComponent } from "@display/timer/timer.component";;
import { DialogAddBeerDialog } from './search/beer-form/form.component';
import { DialogAddBreweryDialog } from './search/brewery-form/form.component';

import { TransactionFormComponent } from './search/transaction-form/transaction-form.component';
import { SharedModule } from '@shared/shared.module';
import { EditModule } from '@nav-bar/edit.module';
import { WebsiteModule } from '@website/website.module';
import { EditFormComponent } from '@item/items-control-page2/edit-form/edit-form.component';
import { ViewFormComponent } from '@item/items-control-page2/view-form/view-form.component';
import { FeatureForm2Component } from '@features/feature-form2/feature-form2.component';
import { FeaturesModule } from '@features/features.module';

@NgModule({
  declarations: [
    AppComponent,
    SigninComponent,
    PropertiesEditComponent,
    PropertyComponent,
    TimerComponent,
    DialogAddBeerDialog,
    DialogAddBreweryDialog,
    EditFormComponent,
    ViewFormComponent,
  ],
  imports: [
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule,
    AngularFireStorageModule,
    AngularFirestoreModule,
    SpecialsModule,
    SocialModule,
    SharedModule,
    DisplayModule,
    EditModule,
    WebsiteModule,
    FeaturesModule
  ],
  entryComponents: [
    DialogAddBeerDialog,
    DialogAddBreweryDialog,
    TransactionFormComponent,
    EditFormComponent,
    ViewFormComponent,
    FeatureForm2Component,

  ],
  exports: [
  ],
  providers: [ManagementService],
  bootstrap: [AppComponent]
})
export class AppModule { }

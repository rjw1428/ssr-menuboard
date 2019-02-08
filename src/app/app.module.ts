import { NgModule } from '@angular/core';

import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { environment } from '@environments/environment';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AppComponent } from './app.component';

import { SigninComponent } from './auth/signin/signin.component'
import { SignupComponent } from './auth/signup/signup.component'
import { ManagementService } from '@shared/services/management.service';

import { SpecialsModule } from '@specials/specials.module';
import { SocialModule } from '@social/social.module';
import { DisplayModule } from './display/display.module';
import { PropertiesEditComponent } from './properties/properties-edit/properties-edit.component';
import { PropertyComponent } from './properties/property/property.component';
import { TimerComponent } from "@display/timer/timer.component";
import { ContentManagerComponent } from './content-manager/content-manager.component';
import { UploadComponent } from './content-manager/upload/upload.component';
import { PreloadDirective } from './shared/directives/preload.directive';
import { DialogAddBeerDialog } from './search/beer-form/form.component';
import { DialogAddBreweryDialog } from './search/brewery-form/form.component';

import { TransactionFormComponent } from './search/transaction-form/transaction-form.component';
import { SharedModule } from '@shared/shared.module';
import { EditModule } from '@nav-bar/edit.module';
import { WebsiteModule } from '@website/website.module';
import { EditFormComponent } from '@item/items-control-page2/edit-form/edit-form.component';
@NgModule({
  declarations: [
    AppComponent,
    SigninComponent,
    SignupComponent,
    PropertiesEditComponent,
    PropertyComponent,
    TimerComponent,
    ContentManagerComponent,
    UploadComponent,
    PreloadDirective,
    DialogAddBeerDialog,
    DialogAddBreweryDialog,
    // TransactionFormComponent,
    EditFormComponent
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
    WebsiteModule
  ],
  entryComponents: [
    DialogAddBeerDialog,
    DialogAddBreweryDialog,
    TransactionFormComponent,
    EditFormComponent
  ],
  exports: [
  ],
  providers: [ManagementService],
  bootstrap: [AppComponent]
})
export class AppModule { }

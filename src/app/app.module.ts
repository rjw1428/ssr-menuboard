import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AngularFireModule } from '@angular/fire';
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
import { RoutingModule } from './routing/routing.module';
import { PropertiesEditComponent } from './properties/properties-edit/properties-edit.component';
import { PropertyComponent } from './properties/property/property.component';
import { TimerComponent } from "@display/timer/timer.component";
import { ContentManagerComponent } from './content-manager/content-manager.component';
import { UploadComponent } from './content-manager/upload/upload.component';
import { PreloaderService } from '@shared/services/preloader.service';
import { PreloadDirective } from './shared/directives/preload.directive';
import { UsernamePipe } from '@shared/pipes/username.pipe';
import { TriviaModule } from '@trivia/trivia.module';

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
  ],
  imports: [
    BrowserModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule,
    AngularFireStorageModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    RoutingModule,
    ItemsModule,
    FeaturesModule,
    SpecialsModule,
    SocialModule,
    TriviaModule,
  ],
  providers: [ManagementService, PreloaderService],
  bootstrap: [AppComponent]
})
export class AppModule { }

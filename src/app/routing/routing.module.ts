import { NgModule } from '@angular/core';
import { SigninComponent } from '../auth/signin/signin.component';
import { DisplayComponent } from '../display/display.component';
import { SignupComponent } from '../auth/signup/signup.component';
import { AuthGaurdService } from '@shared/services/auth-guard.service';
import { Routes, RouterModule } from '@angular/router';
import { NavBarComponent } from '../nav-bar/nav-bar.component';
import { FeaturesControlPageComponent } from '@features/features-control-page/features-control-page.component';
import { ItemsControlPageComponent } from '@item/items-control-page/items-control-page.component';
import { ItemsControlPage2Component } from '@item/items-control-page2/items-control-page2.component'
import { AngularFireAuth } from '@angular/fire/auth';
import { AuthService } from '@shared/services/auth.service';
import { SpecialsControlPageComponent } from '@specials/specials-control-page/specials-control-page.component';
import { PropertiesEditComponent } from '../properties/properties-edit/properties-edit.component';
import { ContentManagerComponent } from 'app/content-manager/content-manager.component';
import { TriviaControlComponent } from '@trivia/trivia-control/trivia-control.component';
import { TeamListComponent } from '@trivia/teams/team-list/team-list.component';
import { SearchComponent } from 'app/search/beer-search/search.component';
import { BrewerySearchComponent } from 'app/search/brewery-search/brewery-search.component';
import { Auth2Service } from '@shared/services/auth2.service';
import { WebsiteComponent } from 'app/website/website.component';
import { ScreenControlComponent } from 'app/screen-control/screen-control.component';

const appRoutes: Routes = [
  { path: '', component: WebsiteComponent},// loadChildren: '@website/website.module#WebsiteModule' },
  { path: 'display/:client/:screen', component: DisplayComponent},// loadChildren: '@display/display.module#DisplayModule' },
  { path: 'signin', component: SigninComponent},
  { path: 'edit/:client', component: NavBarComponent, canActivate: [ AuthGaurdService],
  children: [
    { path: 'items', component: ItemsControlPage2Component},  //
    { path: 'features', component: FeaturesControlPageComponent},
    // { path: 'events', component: SpecialsControlPageComponent},
    { path: 'properties', component: PropertiesEditComponent},
    { path: 'content', component: ContentManagerComponent},
    // { path: 'trivia', component: TriviaControlComponent},
    { path: 'beers', component: SearchComponent},
    { path: 'breweries', component: BrewerySearchComponent},
    { path: 'screens', component: ScreenControlComponent},
  ]},
  { path: 'signup', component: SignupComponent, canActivate: [AuthGaurdService] },
]

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  providers: [AuthService, AuthGaurdService, AngularFireAuth],
  exports: [RouterModule]
})
export class RoutingModule { }

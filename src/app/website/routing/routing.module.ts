import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from '../home/home.component';
import { RedirectComponent } from './redirect/redirect.component';


const appRoutes: Routes = [
  { path: '', component: HomeComponent },
]

@NgModule({
  imports: [RouterModule.forChild(appRoutes)],
  providers: [],
  exports: [RouterModule],
  declarations: []
})
export class RoutingModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ItemsDisplayPage2Component } from '@item/items-display-page2/items-display-page2.component';
import { SinglePageComponent } from './single-page/single-page.component';
import { DemoComponent } from './single-page/demo/demo.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from '@shared/shared.module';
import { DisplayComponent } from './display.component';
import { StaticComponent } from '@static/static.component';
import { TriviaModule } from '@trivia/trivia.module';
import { FeaturePageComponent } from '@features/feature-page/feature-page.component';
import { FeaturesService } from '@shared/services/features.service';
import { ItemsDisplayPageVertComponent } from '@item/items-display-page-vert/items-display-page-vert.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    NgbModule,
    TriviaModule,
  ],
  declarations: [
    ItemsDisplayPage2Component,
    ItemsDisplayPageVertComponent,
    FeaturePageComponent,
    DisplayComponent,
    StaticComponent,
    // SlideDirective,
    SinglePageComponent,
    DemoComponent,
  ],
  providers: [
    FeaturesService
  ]
})
export class DisplayModule { }

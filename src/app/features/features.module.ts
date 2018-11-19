import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { FeaturePageComponent } from '@features/feature-page/feature-page.component'
import { FeatureComponent } from '@features/feature/feature.component';
import { FeatureFormComponent } from '@features/feature-form/feature-form.component';
import { FeaturesControlPageComponent } from '@features/features-control-page/features-control-page.component';
import { FeaturesService } from '@shared/services/features.service';
import { FormsModule } from "@angular/forms";
import { FeatureTitlePipe } from "@shared/pipes/feature-title.pipe";
import { FeatureMainPipe } from "@shared/pipes/feature-main.pipe";

@NgModule({
    imports: [
        CommonModule, //ACCEPT PUBLICLY AVAILABLE COMPONENTS
        FormsModule,
    ],
    declarations: [ //PRIVATE TO THIS MODULE
        FeaturePageComponent,
        FeatureComponent,
        FeatureFormComponent,
        FeaturesControlPageComponent,
        FeatureTitlePipe,
        FeatureMainPipe
    ],
    providers: [
        FeaturesService
    ],
    exports: [        
        FeaturePageComponent,
        FeatureComponent,
        FeatureFormComponent,
        FeaturesControlPageComponent,
    ],//PUBLICLY AVAILABLE
    bootstrap: [] //BASE COMPONENT
})
export class FeaturesModule{ }
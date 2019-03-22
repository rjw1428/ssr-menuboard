import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FeaturesControlPageComponent } from '@features/features-control-page/features-control-page.component';
import { FeatureForm2Component } from './feature-form2/feature-form2.component';
import { SharedModule } from '@shared/shared.module';
import { DragDropModule } from '@angular/cdk/drag-drop';

@NgModule({
    imports: [
        CommonModule, //ACCEPT PUBLICLY AVAILABLE COMPONENTS
        SharedModule,
        DragDropModule
    ],
    declarations: [ //PRIVATE TO THIS MODULE
        FeaturesControlPageComponent,
        FeatureForm2Component,
    ],
    providers: [
    ],
    exports: [        
    ],//PUBLICLY AVAILABLE
    bootstrap: [] //BASE COMPONENT
})
export class FeaturesModule{ }
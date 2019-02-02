import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { ItemFormComponent } from '@item/item-form/item-form.component'
import { ItemCategoryComponent } from '@item/item-category/item-category.component';
import { ItemsControlPageComponent } from '@item/items-control-page/items-control-page.component';
import { ItemsDisplayPageComponent } from '@item/items-display-page/items-display-page.component';
import { ItemComponent } from '@item/item/item.component';
import { ItemsService } from "@shared/services/items.service";
import { ItemCategoryFormComponent } from '@item/item-category-form/item-category-form.component';
import { FormsModule } from "@angular/forms";
import { CategoryService } from "@shared/services/category.service";
import { IconNamePipe } from "@shared/pipes/icon-name.pipe";
import { AbvPipe } from "@shared/pipes/abv.pipe";
import { TitlecasePipe } from "@shared/pipes/titlecase.pipe"
import { ManagementService } from "@shared/services/management.service";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { ItemPropertiesComponent } from './item-properties/item-properties.component';
import { ItemsDisplayPage2Component } from './items-display-page2/items-display-page2.component';
import { ItemsControlPage2Component } from './items-control-page2/items-control-page2.component';


@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        BrowserAnimationsModule,
    ],
    declarations: [
        ItemFormComponent,
        ItemCategoryComponent,
        ItemsControlPageComponent,
        ItemsDisplayPageComponent,
        ItemCategoryFormComponent,
        IconNamePipe,
        AbvPipe,
        TitlecasePipe,
        ItemComponent,
        ItemPropertiesComponent,
        ItemsDisplayPage2Component,
        ItemsControlPage2Component,
    ],
    providers: [
        ItemsService, CategoryService, ManagementService
    ],
    exports: [
        ItemFormComponent,
        ItemCategoryComponent,
        ItemsControlPageComponent,
        ItemsDisplayPageComponent,
        ItemComponent,
        ItemPropertiesComponent,
        ItemsDisplayPage2Component,
    ]
})
export class ItemsModule { }
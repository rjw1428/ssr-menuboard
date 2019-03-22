import { NgModule } from "@angular/core";

import { ItemFormComponent } from '@item/item-form/item-form.component'
import { ItemCategoryComponent } from '@item/item-category/item-category.component';
import { ItemsControlPageComponent } from '@item/items-control-page/items-control-page.component';
import { ItemsDisplayPageComponent } from '@item/items-display-page/items-display-page.component';
import { ItemComponent } from '@item/item/item.component';
import { ItemsService } from "@shared/services/items.service";
import { ItemCategoryFormComponent } from '@item/item-category-form/item-category-form.component';
import { CategoryService } from "@shared/services/category.service";
import { ManagementService } from "@shared/services/management.service";
import { ItemPropertiesComponent } from './item-properties/item-properties.component';
import { SharedModule } from "@shared/shared.module";

@NgModule({
    imports: [
        SharedModule,
    ],
    declarations: [
        ItemFormComponent,
        ItemCategoryComponent,
        ItemsControlPageComponent,
        ItemsDisplayPageComponent,
        ItemCategoryFormComponent,
        ItemComponent,
        ItemPropertiesComponent,
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
    ]
})
export class ItemsModule { }
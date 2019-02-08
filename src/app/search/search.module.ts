import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchComponent } from './beer-search/search.component';
import { BrewerySearchComponent } from './brewery-search/brewery-search.component';
import { BreweryComponent } from './brewery-search/brewery/brewery.component';
import { BeerComponent } from './beer-search/beer/beer.component';
import { TransactionFormComponent } from './transaction-form/transaction-form.component';
import { SharedModule } from '@shared/shared.module';


@NgModule({
  imports: [
    CommonModule,
    SharedModule,
  ],
  declarations: [
    SearchComponent,
    BrewerySearchComponent,
    BreweryComponent,
    BeerComponent,
    TransactionFormComponent,
  ]
})
export class SearchModule { }

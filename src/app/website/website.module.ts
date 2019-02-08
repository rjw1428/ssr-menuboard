import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WebsiteComponent } from './website.component';
import { PricingComponent } from './pricing/pricing.component';
import { PriceComponent } from './pricing/price/price.component';
import { QuotesComponent } from './quotes/quotes.component';
import { QuoteComponent } from './quotes/quote/quote.component';
import { ContactComponent } from './contact/contact.component';
import { FooterComponent } from './footer/footer.component';
import { HomeComponent } from './home/home.component';
import { RedirectComponent } from './routing/redirect/redirect.component';
import { RoutingService } from './routing/redirect/routing.service';
import { RoutingModule } from './routing/routing.module';
import { SharedModule } from '@shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    RoutingModule,
  ],
  declarations: [
    WebsiteComponent,
    PricingComponent,
    PriceComponent,
    QuotesComponent,
    QuoteComponent,
    ContactComponent,
    FooterComponent,
    HomeComponent,
    RedirectComponent
  ],
  providers: [RoutingService],
})
export class WebsiteModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MarketingRoutingModule, marketingRoutingComponents } from './routing.module';

@NgModule({
    imports: [
        CommonModule,
        MarketingRoutingModule
    ],
    declarations: [...marketingRoutingComponents]
})
export class MarketingModule { }

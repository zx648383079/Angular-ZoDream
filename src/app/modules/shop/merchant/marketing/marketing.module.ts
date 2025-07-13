import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MarketingRoutingModule, marketingRoutingComponents } from './routing.module';
import { DesktopModule } from '../../../../components/desktop';

@NgModule({
    imports: [
        CommonModule,
        DesktopModule,
        MarketingRoutingModule
    ],
    declarations: [...marketingRoutingComponents]
})
export class MarketingModule { }

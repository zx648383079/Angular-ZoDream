import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { merchantRoutingComponents, MerchantRoutingModule } from './merchant-routing.module';
import { ThemeModule } from '../../theme/theme.module';

@NgModule({
    imports: [
        CommonModule,
        ThemeModule,
        MerchantRoutingModule
    ],
    declarations: [...merchantRoutingComponents]
})
export class MerchantModule { }

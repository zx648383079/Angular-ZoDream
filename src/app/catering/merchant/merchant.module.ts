import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { merchantRoutingComponents, MerchantRoutingModule } from './merchant-routing.module';
import { ThemeModule } from '../../theme/theme.module';
import { ZreFormModule } from '../../form';
import { NgSelectModule } from '@ng-select/ng-select';

@NgModule({
    imports: [
        CommonModule,
        ThemeModule,
        ZreFormModule,
        NgSelectModule,
        MerchantRoutingModule
    ],
    declarations: [...merchantRoutingComponents]
})
export class MerchantModule { }

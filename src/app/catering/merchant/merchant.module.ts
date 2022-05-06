import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { merchantRoutingComponents, MerchantRoutingModule } from './merchant-routing.module';
import { ThemeModule } from '../../theme/theme.module';
import { ZreFormModule } from '../../form';
import { NgSelectModule } from '@ng-select/ng-select';
import { DialogModule } from '../../dialog';

@NgModule({
    imports: [
        CommonModule,
        ThemeModule,
        ZreFormModule,
        DialogModule,
        NgSelectModule,
        MerchantRoutingModule
    ],
    declarations: [...merchantRoutingComponents]
})
export class MerchantModule { }

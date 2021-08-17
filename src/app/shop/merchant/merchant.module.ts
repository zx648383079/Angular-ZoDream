import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule } from '../../dialog';
import { merchantRoutingComponents, MerchantRoutingModule } from './merchant-routing.module';
import { ThemeModule } from '../../theme/theme.module';

@NgModule({
    imports: [
        CommonModule,
        ThemeModule,
        MerchantRoutingModule,
        DialogModule,
    ],
    declarations: [...merchantRoutingComponents]
})
export class MerchantModule { }

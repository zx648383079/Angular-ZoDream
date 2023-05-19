import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule } from '../../../components/dialog';
import { merchantRoutingComponents, MerchantRoutingModule } from './merchant-routing.module';
import { ThemeModule } from '../../../theme/theme.module';
import { ShopService } from './shop.service';

@NgModule({
    imports: [
        CommonModule,
        ThemeModule,
        MerchantRoutingModule,
        DialogModule,
    ],
    declarations: [...merchantRoutingComponents],
    providers: [
        ShopService
    ]
})
export class MerchantModule { }

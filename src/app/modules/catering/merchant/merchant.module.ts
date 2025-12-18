import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { merchantRoutingComponents, MerchantRoutingModule } from './merchant-routing.module';
import { ThemeModule } from '../../../theme/theme.module';
import { ZreFormModule } from '../../../components/form';
import { NgSelectModule } from '@ng-select/ng-select';
import { DialogModule } from '../../../components/dialog';
import { ZreSwiperModule } from '../../../components/swiper';
import { DesktopModule } from '../../../components/desktop';
import { Field } from '@angular/forms/signals';

@NgModule({
    imports: [
        CommonModule,
        ThemeModule,
        Field,
        ZreFormModule,
        DesktopModule,
        DialogModule,
        NgSelectModule,
        ZreSwiperModule,
        MerchantRoutingModule
    ],
    declarations: [...merchantRoutingComponents]
})
export class MerchantModule { }

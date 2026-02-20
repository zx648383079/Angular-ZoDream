import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { merchantRoutingComponents, MerchantRoutingModule } from './merchant-routing.module';
import { ThemeModule } from '../../../theme/theme.module';
import { ZreFormModule } from '../../../components/form';
import { DialogModule } from '../../../components/dialog';
import { ZreSwiperModule } from '../../../components/swiper';
import { DesktopModule } from '../../../components/desktop';
import { FormField } from '@angular/forms/signals';

@NgModule({
    imports: [
        CommonModule,
        ThemeModule,
        FormField,
        ZreFormModule,
        DesktopModule,
        DialogModule,
        ZreSwiperModule,
        MerchantRoutingModule
    ],
    declarations: [...merchantRoutingComponents]
})
export class MerchantModule { }

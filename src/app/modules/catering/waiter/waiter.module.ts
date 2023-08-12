import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { waiterRoutingComponents, WaiterRoutingModule } from './waiter-routing.module';
import { ThemeModule } from '../../../theme/theme.module';
import { DialogModule } from '../../../components/dialog';
import { ZreSwiperModule } from '../../../components/swiper';
import { ZreFormModule } from '../../../components/form';

@NgModule({
    imports: [
        CommonModule,
        ThemeModule,
        DialogModule,
        ZreSwiperModule,
        ZreFormModule,
        WaiterRoutingModule
    ],
    declarations: [...waiterRoutingComponents]
})
export class WaiterModule { }

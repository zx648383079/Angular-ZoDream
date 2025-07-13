import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { marketRoutingComponents, MarketRoutingModule } from './market-routing.module';
import { ThemeModule } from '../../../theme/theme.module';
import { ReactiveFormsModule } from '@angular/forms';
import { GameModule } from '../game/game.module';
import { ZreFormModule } from '../../../components/form';
import { ShopCommonModule } from '../common.module';
import { ZreSwiperModule } from '../../../components/swiper';
import { DesktopModule } from '../../../components/desktop';

@NgModule({
    declarations: [...marketRoutingComponents],
    imports: [
        CommonModule,
        MarketRoutingModule,
        ThemeModule,
        DesktopModule,
        ReactiveFormsModule,
        GameModule,
        ZreFormModule,
        ZreSwiperModule,
        ShopCommonModule,
    ],
    schemas: [
        CUSTOM_ELEMENTS_SCHEMA
    ]
})
export class MarketModule { }

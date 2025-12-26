import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';

import { marketRoutingComponents, MarketRoutingModule } from './market-routing.module';
import { ThemeModule } from '../../../theme/theme.module';
import { GameModule } from '../game/game.module';
import { ZreFormModule } from '../../../components/form';
import { ShopCommonModule } from '../common.module';
import { ZreSwiperModule } from '../../../components/swiper';
import { DesktopModule } from '../../../components/desktop';
import { Field } from '@angular/forms/signals';

@NgModule({
    declarations: [...marketRoutingComponents],
    imports: [
        CommonModule,
        Field,
        NgOptimizedImage,
        MarketRoutingModule,
        ThemeModule,
        DesktopModule,
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

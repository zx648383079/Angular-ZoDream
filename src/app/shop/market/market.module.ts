import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SwiperModule } from 'swiper/angular';

import { marketRoutingComponents, MarketRoutingModule } from './market-routing.module';
import { LazyLoadImageModule } from 'ng-lazyload-image';
import { ThemeModule } from '../../theme/theme.module';
import { ReactiveFormsModule } from '@angular/forms';
import { GameModule } from '../game/game.module';
import { ZreFormModule } from '../../form';
import { ShopCommonModule } from '../common.module';

@NgModule({
    declarations: [...marketRoutingComponents],
    imports: [
        CommonModule,
        MarketRoutingModule,
        ThemeModule,
        ReactiveFormsModule,
        LazyLoadImageModule,
        GameModule,
        ZreFormModule,
        ShopCommonModule,
        SwiperModule,
    ]
})
export class MarketModule { }

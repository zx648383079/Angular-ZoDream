import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { marketRoutingComponents, MarketRoutingModule } from './market-routing.module';
import { LazyLoadImageModule } from 'ng-lazyload-image';
import { ThemeModule } from '../../../theme/theme.module';
import { ReactiveFormsModule } from '@angular/forms';
import { GameModule } from '../game/game.module';
import { ZreFormModule } from '../../../components/form';
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
    ],
    schemas: [
        CUSTOM_ELEMENTS_SCHEMA
    ]
})
export class MarketModule { }

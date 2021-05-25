import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { marketRoutingComponents, MarketRoutingModule } from './market-routing.module';
import { LazyLoadImageModule } from 'ng-lazyload-image';
import { ThemeModule } from '../../theme/theme.module';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { GameModule } from '../game/game.module';
import { ZreFormModule } from '../../form';

@NgModule({
    declarations: [...marketRoutingComponents],
    imports: [
        CommonModule,
        MarketRoutingModule,
        ThemeModule,
        NgbModule,
        ReactiveFormsModule,
        LazyLoadImageModule,
        GameModule,
        ZreFormModule,
    ]
})
export class MarketModule { }

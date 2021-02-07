import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { marketRoutingComponents, MarketRoutingModule } from './market-routing.module';
import { LazyLoadImageModule } from 'ng-lazyload-image';
import { ThemeModule } from '../../theme/theme.module';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [...marketRoutingComponents],
  imports: [
    CommonModule,
    MarketRoutingModule,
    ThemeModule,
    ReactiveFormsModule,
    LazyLoadImageModule,
  ]
})
export class MarketModule { }

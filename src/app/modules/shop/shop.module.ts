import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ShopRoutingModule } from './shop-routing.module';
import { ShopComponent } from './shop.component';
import { ShopService } from './shop.service';
import { StoreModule } from '@ngrx/store';
import * as shopReducer from './shop.reducer';


@NgModule({
  declarations: [ShopComponent],
  imports: [
    CommonModule,
    ShopRoutingModule,
    StoreModule.forFeature(shopReducer.shopFeatureKey, shopReducer.reducer),
  ],
  providers: [
    ShopService
  ]
})
export class ShopModule { }

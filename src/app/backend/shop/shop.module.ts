import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ShopRoutingModule, shopRoutedComponents } from './shop-routing.module';


@NgModule({
  declarations: [...shopRoutedComponents],
  imports: [
    CommonModule,
    ShopRoutingModule
  ]
})
export class ShopModule { }

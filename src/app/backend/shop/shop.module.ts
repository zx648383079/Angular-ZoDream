import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ShopRoutingModule, shopRoutedComponents } from './shop-routing.module';
import { ThemeModule } from '../../theme/theme.module';


@NgModule({
  declarations: [...shopRoutedComponents],
  imports: [
    CommonModule,
    ThemeModule,
    ShopRoutingModule
  ]
})
export class ShopModule { }

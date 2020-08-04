import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ShopRoutingModule, shopRoutedComponents } from './shop-routing.module';
import { ThemeModule } from '../../theme/theme.module';
import { ShopService } from './shop.service';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';


@NgModule({
  declarations: [...shopRoutedComponents],
  imports: [
    CommonModule,
    NgbPaginationModule,
    ReactiveFormsModule,
    ThemeModule,
    ShopRoutingModule
  ],
  providers: [
    ShopService,
  ],
})
export class ShopModule { }

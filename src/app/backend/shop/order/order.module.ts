import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { orderRoutedComponents, OrderRoutingModule } from './order-routing.routing';
import { ThemeModule } from '../../../theme/theme.module';

@NgModule({
  imports: [
    CommonModule,
    ThemeModule,
    OrderRoutingModule
  ],
  declarations: [...orderRoutedComponents]
})
export class OrderModule { }

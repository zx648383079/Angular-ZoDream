import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderComponent } from './order.component';
import { orderRoutedComponents, OrderRoutingModule } from './order-routing.routing';

@NgModule({
  imports: [
    CommonModule,
    OrderRoutingModule
  ],
  declarations: [...orderRoutedComponents]
})
export class OrderModule { }

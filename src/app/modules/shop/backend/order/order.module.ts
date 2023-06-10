import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { orderRoutedComponents, OrderRoutingModule } from './order-routing.routing';
import { ThemeModule } from '../../../../theme/theme.module';
import { OrderService } from './order.service';
import { ReactiveFormsModule } from '@angular/forms';
import { ZreFormModule } from '../../../../components/form';
import { DialogModule } from '../../../../components/dialog';
import { ShopManageModule } from '../../components';

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        ThemeModule,
        OrderRoutingModule,
        ZreFormModule,
        DialogModule,
        ShopManageModule,
    ],
    declarations: [...orderRoutedComponents],
    providers: [
        OrderService,
    ],
})
export class OrderModule { }

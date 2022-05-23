import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { orderRoutedComponents, OrderRoutingModule } from './order-routing.routing';
import { ThemeModule } from '../../../../theme/theme.module';
import { OrderService } from './order.service';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { ZreFormModule } from '../../../../components/form';
import { DialogModule } from '../../../../components/dialog';

@NgModule({
    imports: [
        CommonModule,
        NgbPaginationModule,
        ReactiveFormsModule,
        ThemeModule,
        OrderRoutingModule,
        ZreFormModule,
        DialogModule,
    ],
    declarations: [...orderRoutedComponents],
    providers: [
        OrderService,
    ],
})
export class OrderModule { }

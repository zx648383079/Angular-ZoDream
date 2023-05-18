import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderRoutingModule, orderRoutingComponents } from './routing.module';

@NgModule({
    imports: [
        CommonModule,
        OrderRoutingModule
    ],
    declarations: [...orderRoutingComponents]
})
export class OrderModule { }

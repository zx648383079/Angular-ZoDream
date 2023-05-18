import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductRoutingModule, productRoutingComponents } from './routing.module';

@NgModule({
    imports: [
        CommonModule,
        ProductRoutingModule
    ],
    declarations: [...productRoutingComponents]
})
export class ProductModule { }

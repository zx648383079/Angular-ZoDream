import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AfterSalesRoutingModule, afterSalesRoutingComponents } from './routing.module';

@NgModule({
    imports: [
        CommonModule,
        AfterSalesRoutingModule
    ],
    declarations: [...afterSalesRoutingComponents]
})
export class AfterSalesModule { }

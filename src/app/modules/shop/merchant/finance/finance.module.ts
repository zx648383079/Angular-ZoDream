import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FinanceRoutingModule, financeRoutingComponents } from './routing.module';

@NgModule({
    imports: [
        CommonModule,
        FinanceRoutingModule
    ],
    declarations: [...financeRoutingComponents]
})
export class FinanceModule { }

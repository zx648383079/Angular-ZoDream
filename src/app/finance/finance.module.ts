import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { financeRoutedComponents, FinanceRoutingModule } from './finance-routing.module';
import { ThemeModule } from '../theme/theme.module';
import { FinanceService } from './finance.service';
import { LogTypePipe } from './log-type.pipe';

@NgModule({
    imports: [
        CommonModule,
        ThemeModule,
        FinanceRoutingModule
    ],
    declarations: [...financeRoutedComponents, LogTypePipe],
    providers: [
        FinanceService,
    ]
})
export class FinanceModule { }
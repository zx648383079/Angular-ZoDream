import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { financeRoutedComponents, FinanceRoutingModule } from './finance-routing.module';
import { ThemeModule } from '../../theme/theme.module';
import { FinanceService } from './finance.service';
import { LogTypePipe } from './log-type.pipe';
import { DialogModule } from '../../components/dialog';
import { ZreFormModule } from '../../components/form';
import { NgxEchartsModule } from 'ngx-echarts';

@NgModule({
    imports: [
        CommonModule,
        ThemeModule,
        FinanceRoutingModule,
        DialogModule,
        ZreFormModule,
        NgxEchartsModule.forChild()
    ],
    declarations: [...financeRoutedComponents, LogTypePipe],
    providers: [
        FinanceService,
    ]
})
export class FinanceModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { financeRoutedComponents, FinanceRoutingModule } from './finance-routing.module';
import { ThemeModule } from '../theme/theme.module';
import { FinanceService } from './finance.service';
import { LogTypePipe } from './log-type.pipe';
import { DialogModule } from '../dialog';
import { ZreFormModule } from '../form';
import * as echarts from 'echarts/core';
import { LineChart } from 'echarts/charts';
import {
  TitleComponent,
  TooltipComponent,
  GridComponent
} from 'echarts/components';
import {
    CanvasRenderer
  } from 'echarts/renderers';
  import 'echarts/theme/macarons.js';
import { NgxEchartsModule } from 'ngx-echarts';

echarts.use(
    [TitleComponent, TooltipComponent, GridComponent, LineChart, CanvasRenderer]
);

@NgModule({
    imports: [
        CommonModule,
        ThemeModule,
        FinanceRoutingModule,
        NgxEchartsModule.forRoot({ echarts }),
        DialogModule,
        ZreFormModule,
    ],
    declarations: [...financeRoutedComponents, LogTypePipe],
    providers: [
        FinanceService,
    ]
})
export class FinanceModule { }

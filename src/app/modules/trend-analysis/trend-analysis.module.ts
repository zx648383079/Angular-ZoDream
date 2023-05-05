import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule } from '../../components/dialog';
import { ZreFormModule } from '../../components/form';
import { ThemeModule } from '../../theme/theme.module';
import { TrendRoutingModule, trendRoutingComponents } from './routing.module';
import { TrendService } from './trend.service';
import { NgxEchartsModule } from 'ngx-echarts';
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

echarts.use(
  [TitleComponent, TooltipComponent, GridComponent, LineChart, CanvasRenderer]
);

@NgModule({
    imports: [
        CommonModule,
        ThemeModule,
        TrendRoutingModule,
        ZreFormModule,
        NgxEchartsModule.forRoot({ echarts }),
        DialogModule
    ],
    declarations: [...trendRoutingComponents],
    providers: [
        TrendService
    ]
})
export class TrendAnalysisModule { }

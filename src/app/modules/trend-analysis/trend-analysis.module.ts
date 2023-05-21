import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule } from '../../components/dialog';
import { ZreFormModule } from '../../components/form';
import { ThemeModule } from '../../theme/theme.module';
import { TrendRoutingModule, trendRoutingComponents } from './routing.module';
import { TrendService } from './trend.service';
import { NgxEchartsModule } from 'ngx-echarts';

@NgModule({
    imports: [
        CommonModule,
        ThemeModule,
        TrendRoutingModule,
        ZreFormModule,
        DialogModule,
        NgxEchartsModule.forChild()
    ],
    declarations: [...trendRoutingComponents],
    providers: [
        TrendService
    ]
})
export class TrendAnalysisModule { }

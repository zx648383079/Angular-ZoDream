import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule } from '../../components/dialog';
import { ZreFormModule } from '../../components/form';
import { ThemeModule } from '../../theme/theme.module';
import { TrendRoutingModule, trendRoutingComponents } from './routing.module';
import { TrendService } from './trend.service';
import { NgxEchartsModule } from 'ngx-echarts';
import { DesktopModule } from '../../components/desktop';

@NgModule({
    imports: [
        CommonModule,
        ThemeModule,
        DesktopModule,
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

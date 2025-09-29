import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule } from '../../components/dialog';
import { ZreFormModule } from '../../components/form';
import { ThemeModule } from '../../theme/theme.module';
import { TrendRoutingModule, trendRoutingComponents } from './routing.module';
import { TrendService } from './trend.service';
import { DesktopModule } from '../../components/desktop';
import { ZreChartModule } from '../../components/chart';

@NgModule({
    imports: [
        CommonModule,
        ThemeModule,
        DesktopModule,
        TrendRoutingModule,
        ZreFormModule,
        DialogModule,
        ZreChartModule.forChild()
    ],
    declarations: [...trendRoutingComponents],
    providers: [
        TrendService
    ]
})
export class TrendAnalysisModule { }

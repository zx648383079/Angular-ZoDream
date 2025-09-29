import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TrackerRoutedComponents, TrackerRoutingModule } from './routing.module';
import { TrackerService } from './tracker.service';
import { ThemeModule } from '../../theme/theme.module';
import { ZreFormModule } from '../../components/form';
import { DesktopModule } from '../../components/desktop';
import { ZreChartModule } from '../../components/chart';

@NgModule({
    imports: [
        CommonModule,
        ThemeModule,
        DesktopModule,
        ZreFormModule,
        ZreChartModule.forChild(),
        TrackerRoutingModule
    ],
    declarations: [...TrackerRoutedComponents],
    providers: [
        TrackerService
    ]
})
export class TradeTrackerModule { }

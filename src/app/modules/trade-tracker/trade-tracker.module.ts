import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TrackerRoutedComponents, TrackerRoutingModule } from './routing.module';
import { TrackerService } from './tracker.service';
import { ThemeModule } from '../../theme/theme.module';
import { NgxEchartsModule } from 'ngx-echarts';
import { ZreFormModule } from '../../components/form';
import { DesktopModule } from '../../components/desktop';

@NgModule({
    imports: [
        CommonModule,
        ThemeModule,
        DesktopModule,
        ZreFormModule,
        NgxEchartsModule.forChild(),
        TrackerRoutingModule
    ],
    declarations: [...TrackerRoutedComponents],
    providers: [
        TrackerService
    ]
})
export class TradeTrackerModule { }

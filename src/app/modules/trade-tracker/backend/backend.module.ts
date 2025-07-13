import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TrackerBackendRoutedComponents, TrackerBackendRoutingModule } from './routing.module';
import { TrackerBackendService } from './tracker.service';
import { ThemeModule } from '../../../theme/theme.module';
import { DialogModule } from '../../../components/dialog';
import { ZreFormModule } from '../../../components/form';
import { DesktopModule } from '../../../components/desktop';

@NgModule({
    imports: [
        CommonModule,
        ThemeModule,
        DesktopModule,
        DialogModule,
        ZreFormModule,
        TrackerBackendRoutingModule
    ],
    declarations: [...TrackerBackendRoutedComponents],
    providers: [
        TrackerBackendService,
    ]
})
export class TradeTrackerBackendModule { }

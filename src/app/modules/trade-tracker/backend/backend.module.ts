import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TrackerBackendRoutedComponents, TrackerBackendRoutingModule } from './routing.module';
import { TrackerBackendService } from './tracker.service';

@NgModule({
    imports: [
        CommonModule,
        TrackerBackendRoutingModule
    ],
    declarations: [...TrackerBackendRoutedComponents],
    providers: [
        TrackerBackendService,
    ]
})
export class TradeTrackerBackendModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TrackerRoutedComponents, TrackerRoutingModule } from './routing.module';
import { TrackerService } from './tracker.service';

@NgModule({
    imports: [
        CommonModule,
        TrackerRoutingModule
    ],
    declarations: [...TrackerRoutedComponents],
    providers: [
        TrackerService
    ]
})
export class TradeTrackerModule { }

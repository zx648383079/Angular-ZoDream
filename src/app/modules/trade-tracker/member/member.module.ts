import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TrackerMemberRoutedComponents, TrackerMemberRoutingModule } from './routing.module';
import { TrackerMemberService } from './tracker.service';

@NgModule({
    imports: [
        CommonModule,
        TrackerMemberRoutingModule,
    ],
    declarations: [...TrackerMemberRoutedComponents],
    providers: [
        TrackerMemberService
    ]
})
export class TradeTrackerMemberModule { }

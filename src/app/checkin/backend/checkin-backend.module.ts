import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeModule } from '../../theme/theme.module';
import { checkInBackendRoutingComponents, CheckInBackendRoutingModule } from './backend-routing.module';
import { CheckinService } from './checkin.service';

@NgModule({
    imports: [
        CommonModule,
        ThemeModule,
        CheckInBackendRoutingModule,
    ],
    declarations: [...checkInBackendRoutingComponents],
    providers: [
        CheckinService,
    ]
})
export class CheckinBackendModule { }

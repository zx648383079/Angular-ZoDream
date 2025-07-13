import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeModule } from '../../../theme/theme.module';
import { checkInBackendRoutingComponents, CheckInBackendRoutingModule } from './backend-routing.module';
import { CheckinService } from './checkin.service';
import { DesktopModule } from '../../../components/desktop';

@NgModule({
    imports: [
        CommonModule,
        ThemeModule,
        DesktopModule,
        CheckInBackendRoutingModule,
    ],
    declarations: [...checkInBackendRoutingComponents],
    providers: [
        CheckinService,
    ]
})
export class CheckinBackendModule { }

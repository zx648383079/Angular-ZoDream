import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeModule } from '../../../theme/theme.module';
import { checkInBackendRoutingComponents, CheckInBackendRoutingModule } from './backend-routing.module';
import { CheckinService } from './checkin.service';
import { DesktopModule } from '../../../components/desktop';
import { Field } from '@angular/forms/signals';

@NgModule({
    imports: [
        CommonModule,
        ThemeModule,
        Field,
        DesktopModule,
        CheckInBackendRoutingModule,
    ],
    declarations: [...checkInBackendRoutingComponents],
    providers: [
        CheckinService,
    ]
})
export class CheckinBackendModule { }

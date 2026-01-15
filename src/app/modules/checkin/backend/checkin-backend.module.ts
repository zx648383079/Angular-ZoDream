import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeModule } from '../../../theme/theme.module';
import { checkInBackendRoutingComponents, CheckInBackendRoutingModule } from './backend-routing.module';
import { CheckinService } from './checkin.service';
import { DesktopModule } from '../../../components/desktop';
import { FormField } from '@angular/forms/signals';
import { ZreFormModule } from '../../../components/form';

@NgModule({
    imports: [
        CommonModule,
        ThemeModule,
        FormField,
        DesktopModule,
        ZreFormModule,
        CheckInBackendRoutingModule,
    ],
    declarations: [...checkInBackendRoutingComponents],
    providers: [
        CheckinService,
    ]
})
export class CheckinBackendModule { }

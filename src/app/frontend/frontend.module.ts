import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { frontendRoutedComponents, FrontendRoutingModule } from './frontend-routing.module';
import { FrontendService } from './frontend.service';
import { OnlineServiceModule } from '../modules/online-service/online-service.module';
import { ThemeModule } from '../theme/theme.module';
import { CheckinModule } from '../modules/checkin/checkin.module';
import { DialogModule } from '../components/dialog';
import { ZreFormModule } from '../components/form';
import { AuthSharedModule } from '../modules/auth/auth-shared.module';
import { DesktopModule } from '../components/desktop';
import { Field } from '@angular/forms/signals';


@NgModule({
    declarations: [...frontendRoutedComponents],
    imports: [
        CommonModule,
        ThemeModule,
        Field,
        CheckinModule,
        DesktopModule,
        FrontendRoutingModule,
        OnlineServiceModule,
        DialogModule,
        ZreFormModule,
        AuthSharedModule,
    ],
    providers: [
        FrontendService
    ]
})
export class FrontendModule { }

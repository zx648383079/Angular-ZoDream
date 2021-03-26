import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { frontendRoutedComponents, FrontendRoutingModule } from './frontend-routing.module';
import { FrontendService } from './frontend.service';
import { OnlineServiceModule } from '../online-service/online-service.module';
import { ThemeModule } from '../theme/theme.module';
import { CheckinModule } from '../checkin/checkin.module';


@NgModule({
    declarations: [...frontendRoutedComponents],
    imports: [
        CommonModule,
        ThemeModule,
        CheckinModule,
        FrontendRoutingModule,
        OnlineServiceModule,
    ],
    providers: [
        FrontendService
    ]
})
export class FrontendModule { }

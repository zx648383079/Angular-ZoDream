import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { onlineServiceBackendRoutingComponents, OnlineServiceBackendRoutingModule } from './backend-routing.module';
import { ThemeModule } from '../../../theme/theme.module';
import { OnlineBackendService } from './online.service';
import { MessageContainerModule } from '../../../components/message-container';
import { DialogModule } from '../../../components/dialog';
import { ZreFormModule } from '../../../components/form';
import { DesktopModule } from '../../../components/desktop';

@NgModule({
    imports: [
        CommonModule,
        ThemeModule,
        DesktopModule,
        OnlineServiceBackendRoutingModule,
        MessageContainerModule,
        DialogModule,
        ZreFormModule,
    ],
    declarations: [...onlineServiceBackendRoutingComponents],
    providers: [
        OnlineBackendService,
    ]
})
export class ServiceBackendModule { }

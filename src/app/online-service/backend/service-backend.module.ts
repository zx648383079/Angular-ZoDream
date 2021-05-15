import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { onlineServiceBackendRoutingComponents, OnlineServiceBackendRoutingModule } from './backend-routing.module';
import { ThemeModule } from '../../theme/theme.module';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { ReactiveFormsModule } from '@angular/forms';
import { OnlineBackendService } from './online.service';
import { MessageContainerModule } from '../../message-container/message-container.module';
import { DialogModule } from '../../dialog';

@NgModule({
    imports: [
        CommonModule,
        ThemeModule,
        NgbPaginationModule,
        ReactiveFormsModule,
        OnlineServiceBackendRoutingModule,
        MessageContainerModule,
        DialogModule,
    ],
    declarations: [...onlineServiceBackendRoutingComponents],
    providers: [
        OnlineBackendService,
    ]
})
export class ServiceBackendModule { }

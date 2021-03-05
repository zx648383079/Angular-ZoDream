import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { onlineServiceBackendRoutingComponents, OnlineServiceBackendRoutingModule } from './backend-routing.module';
import { ThemeModule } from '../../theme/theme.module';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { ReactiveFormsModule } from '@angular/forms';
import { OnlineServiceModule } from '../online-service.module';
import { OnlineService } from './online.service';

@NgModule({
    imports: [
        CommonModule,
        ThemeModule,
        NgbPaginationModule,
        ReactiveFormsModule,
        OnlineServiceBackendRoutingModule,
        OnlineServiceModule,
    ],
    declarations: [...onlineServiceBackendRoutingComponents],
    providers: [
        OnlineService,
    ]
})
export class ServiceBackendModule { }

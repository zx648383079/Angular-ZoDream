import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { onlineServiceBackendRoutingComponents, OnlineServiceBackendRoutingModule } from './backend-routing.module';
import { ThemeModule } from '../../theme/theme.module';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { ReactiveFormsModule } from '@angular/forms';
import { OnlineService } from './online.service';
import { OnlineServiceModule } from '../online-service.module';

@NgModule({
    imports: [
        CommonModule,
        ThemeModule,
        NgbPaginationModule,
        ReactiveFormsModule,
        OnlineServiceModule,
        OnlineServiceBackendRoutingModule,
    ],
    declarations: [...onlineServiceBackendRoutingComponents],
    providers: [
        OnlineService,
    ]
})
export class ServiceBackendModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { frontendRoutedComponents, FrontendRoutingModule } from './frontend-routing.module';
import { FrontendService } from './frontend.service';
import { OnlineServiceModule } from '../online-service/online-service.module';


@NgModule({
    declarations: [...frontendRoutedComponents],
    imports: [
        CommonModule,
        FrontendRoutingModule,
        OnlineServiceModule,
    ],
    providers: [
        FrontendService
    ]
})
export class FrontendModule { }

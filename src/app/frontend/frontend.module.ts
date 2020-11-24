import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { frontendRoutedComponents, FrontendRoutingModule } from './frontend-routing.module';
import { FrontendService } from './frontend.service';


@NgModule({
    declarations: [...frontendRoutedComponents],
    imports: [
        CommonModule,
        FrontendRoutingModule
    ],
    providers: [
        FrontendService
    ]
})
export class FrontendModule { }

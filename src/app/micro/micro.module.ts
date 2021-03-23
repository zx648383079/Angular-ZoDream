import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { microRoutingComponents, MicroRoutingModule } from './micro-routing.module';
import { NgbDropdownModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { MicroService } from './micro.service';
import { FormsModule } from '@angular/forms';
import { ThemeModule } from '../theme/theme.module';


@NgModule({
    declarations: [...microRoutingComponents],
    imports: [
        CommonModule,
        FormsModule,
        ThemeModule,
        NgbDropdownModule,
        NgbPaginationModule,
        MicroRoutingModule
    ],
    providers: [
        MicroService
    ]
})
export class MicroModule { }

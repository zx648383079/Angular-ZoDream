import {
    NgModule
} from '@angular/core';
import {
    CommonModule
} from '@angular/common';
import {
    legworkRoutingComponents,
    LegworkRoutingModule
} from './legwork-routing.module';
import { LegworkService } from './legwork.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';

@NgModule({
    imports: [
        CommonModule,
        LegworkRoutingModule,
        FormsModule,
        NgSelectModule,
        ReactiveFormsModule,
    ],
    declarations: [...legworkRoutingComponents],
    providers: [
        LegworkService,
    ]
})
export class LegworkModule {}

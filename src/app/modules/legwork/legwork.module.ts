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
import { ThemeModule } from '../../theme/theme.module';
import { ZreFormModule } from '../../components/form';
import { DesktopModule } from '../../components/desktop';

@NgModule({
    imports: [
        CommonModule,
        DesktopModule,
        LegworkRoutingModule,
        ThemeModule,
        FormsModule,
        NgSelectModule,
        ReactiveFormsModule,
        ZreFormModule,
    ],
    declarations: [...legworkRoutingComponents],
    providers: [
        LegworkService,
    ]
})
export class LegworkModule {}

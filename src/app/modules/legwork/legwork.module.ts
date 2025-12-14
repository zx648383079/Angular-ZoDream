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
import { NgSelectModule } from '@ng-select/ng-select';
import { ThemeModule } from '../../theme/theme.module';
import { ZreFormModule } from '../../components/form';
import { DesktopModule } from '../../components/desktop';
import { Field } from '@angular/forms/signals';

@NgModule({
    imports: [
        CommonModule,
        DesktopModule,
        Field,
        LegworkRoutingModule,
        ThemeModule,
        NgSelectModule,
        ZreFormModule,
    ],
    declarations: [...legworkRoutingComponents],
    providers: [
        LegworkService,
    ]
})
export class LegworkModule {}

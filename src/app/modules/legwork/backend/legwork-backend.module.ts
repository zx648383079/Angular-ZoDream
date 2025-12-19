import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { legworkBackendRoutingComponents, LegworkBackendRoutingModule } from './backend-routing.module';
import { ThemeModule } from '../../../theme/theme.module';
import { LegworkService } from './legwork.service';
import { DialogModule } from '../../../components/dialog';
import { ZreFormModule } from '../../../components/form';
import { DesktopModule } from '../../../components/desktop';
import { Field } from '@angular/forms/signals';

@NgModule({
    imports: [
        CommonModule,
        ThemeModule,
        Field,
        DesktopModule,
        LegworkBackendRoutingModule,
        DialogModule,
        ZreFormModule,
    ],
    declarations: [...legworkBackendRoutingComponents],
    providers: [
        LegworkService
    ]
})
export class LegworkBackendModule { }

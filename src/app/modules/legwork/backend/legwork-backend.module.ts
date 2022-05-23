import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { legworkBackendRoutingComponents, LegworkBackendRoutingModule } from './backend-routing.module';
import { ThemeModule } from '../../../theme/theme.module';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { ReactiveFormsModule } from '@angular/forms';
import { LegworkService } from './legwork.service';
import { DialogModule } from '../../../components/dialog';
import { ZreFormModule } from '../../../components/form';

@NgModule({
    imports: [
        CommonModule,
        ThemeModule,
        LegworkBackendRoutingModule,
        NgbPaginationModule,
        ReactiveFormsModule,
        DialogModule,
        ZreFormModule,
    ],
    declarations: [...legworkBackendRoutingComponents],
    providers: [
        LegworkService
    ]
})
export class LegworkBackendModule { }

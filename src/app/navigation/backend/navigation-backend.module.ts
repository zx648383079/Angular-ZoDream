import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { backendRoutingComponents, BackendRoutingModule } from './backend-routing.module';
import { DialogModule } from '../../dialog';
import { ReactiveFormsModule } from '@angular/forms';
import { ZreFormModule } from '../../form';
import { ThemeModule } from '../../theme/theme.module';
import { NavigationService } from './navigation.service';
import { NgSelectModule } from '@ng-select/ng-select';

@NgModule({
    imports: [
        CommonModule,
        ThemeModule,
        ReactiveFormsModule,
        DialogModule,
        ZreFormModule,
        BackendRoutingModule,
        NgSelectModule,
    ],
    declarations: [...backendRoutingComponents],
    providers: [
        NavigationService
    ]
})
export class NavigationBackendModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { backendRoutingComponents, BackendRoutingModule } from './backend-routing.module';
import { DialogModule } from '../../../components/dialog';
import { ZreFormModule } from '../../../components/form';
import { ThemeModule } from '../../../theme/theme.module';
import { NavigationService } from './navigation.service';
import { DesktopModule } from '../../../components/desktop';
import { FormField } from '@angular/forms/signals';

@NgModule({
    imports: [
        CommonModule,
        ThemeModule,
        FormField,
        DesktopModule,
        DialogModule,
        ZreFormModule,
        BackendRoutingModule,
    ],
    declarations: [...backendRoutingComponents],
    providers: [
        NavigationService
    ]
})
export class NavigationBackendModule { }

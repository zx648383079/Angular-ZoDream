import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { backendRoutingComponents, BackendRoutingModule } from './backend-routing.module';
import { DialogModule } from '../../../components/dialog';
import { ZreFormModule } from '../../../components/form';
import { ThemeModule } from '../../../theme/theme.module';
import { NavigationService } from './navigation.service';
import { NgSelectModule } from '@ng-select/ng-select';
import { DesktopModule } from '../../../components/desktop';

@NgModule({
    imports: [
        CommonModule,
        ThemeModule,
        DesktopModule,
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

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { backendRoutedComponents, BackendRoutingModule } from './backend-routing.module';
import { ThemeModule } from '../../../theme/theme.module';
import { AppService } from './app.service';
import { DialogModule } from '../../../components/dialog';
import { ZreEditorModule } from '../../../components/editor';
import { NgSelectModule } from '@ng-select/ng-select';
import { ZreFormModule } from '../../../components/form';
import { DesktopModule } from '../../../components/desktop';
import { FormField } from '@angular/forms/signals';

@NgModule({
    imports: [
        CommonModule,
        ThemeModule,
        DesktopModule,
        BackendRoutingModule,
        DialogModule,
        NgSelectModule,
        FormField,
        ZreEditorModule,
        ZreFormModule,
    ],
    declarations: [...backendRoutedComponents],
    providers: [
        AppService,
    ]
})
export class AppBackendModule { }

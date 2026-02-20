import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { backendRoutedComponents, BackendRoutingModule } from './backend-routing.module';
import { ThemeModule } from '../../../theme/theme.module';
import { TVService } from './tv.service';
import { DialogModule } from '../../../components/dialog';
import { ZreEditorModule } from '../../../components/editor';
import { ZreFormModule } from '../../../components/form';
import { DesktopModule } from '../../../components/desktop';
import { FormField } from '@angular/forms/signals';

@NgModule({
    imports: [
        CommonModule,
        ThemeModule,
        DesktopModule,
        FormField,
        BackendRoutingModule,
        DialogModule,
        ZreEditorModule,
        ZreFormModule,
    ],
    declarations: [...backendRoutedComponents],
    providers: [
        TVService
    ]
})
export class TvBackendModule { }

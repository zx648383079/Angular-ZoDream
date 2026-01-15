import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeModule } from '../../../theme/theme.module';
import { cateringBackendRoutingComponents, CateringBackendRoutingModule } from './backend-routing.module';
import { CateringBackendService } from './catering.service';
import { ZreFormModule } from '../../../components/form';
import { ZreEditorModule } from '../../../components/editor';
import { DesktopModule } from '../../../components/desktop';
import { FormField } from '@angular/forms/signals';

@NgModule({
    imports: [
        CommonModule,
        FormField,
        CateringBackendRoutingModule,
        ThemeModule,
        DesktopModule,
        ZreFormModule,
        ZreEditorModule,
    ],
    declarations: [...cateringBackendRoutingComponents],
    providers: [
        CateringBackendService
    ]
})
export class CateringBackendModule { }

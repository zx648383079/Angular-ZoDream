import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeModule } from '../../../theme/theme.module';
import { ReactiveFormsModule } from '@angular/forms';
import { cateringBackendRoutingComponents, CateringBackendRoutingModule } from './backend-routing.module';
import { CateringBackendService } from './catering.service';
import { ZreFormModule } from '../../../components/form';
import { ZreEditorModule } from '../../../components/editor';
import { DesktopModule } from '../../../components/desktop';

@NgModule({
    imports: [
        CommonModule,
        CateringBackendRoutingModule,
        ThemeModule,
        DesktopModule,
        ReactiveFormsModule,
        ZreFormModule,
        ZreEditorModule,
    ],
    declarations: [...cateringBackendRoutingComponents],
    providers: [
        CateringBackendService
    ]
})
export class CateringBackendModule { }

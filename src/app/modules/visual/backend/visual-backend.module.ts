import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VisualBackendRoutingModule, visualBackendRoutingComponents } from './backend-routing.module';
import { ThemeModule } from '../../../theme/theme.module';
import { DialogModule } from '../../../components/dialog';
import { ReactiveFormsModule } from '@angular/forms';
import { VisualService } from './visual.service';
import { ZreFormModule } from '../../../components/form';
import { ZreEditorModule } from '../../../components/editor';
import { DesktopModule } from '../../../components/desktop';

@NgModule({
    imports: [
        CommonModule,
        ThemeModule,
        DesktopModule,
        DialogModule,
        ReactiveFormsModule,
        VisualBackendRoutingModule,
        ZreFormModule,
        ZreEditorModule,
    ],
    declarations: [...visualBackendRoutingComponents],
    providers: [
        VisualService
    ]
})
export class VisualBackendModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeModule } from '../../../theme/theme.module';
import { DialogModule } from '../../../components/dialog';
import { VisualMemberRoutingModule, visualMemberRoutingComponents } from './visual-routing.module';
import { ZreFormModule } from '../../../components/form';
import { ZreEditorModule } from '../../../components/editor';
import { VisualService } from './visual.service';
import { DesktopModule } from '../../../components/desktop';
import { FormField } from '@angular/forms/signals';

@NgModule({
    imports: [
        CommonModule,
        ThemeModule,
        FormField,
        DesktopModule,
        DialogModule,
        VisualMemberRoutingModule,
        ZreFormModule,
        ZreEditorModule,
    ],
    declarations: [...visualMemberRoutingComponents],
    providers: [
        VisualService
    ]
})
export class VisualMemberModule { }

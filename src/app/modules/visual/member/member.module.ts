import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeModule } from '../../../theme/theme.module';
import { DialogModule } from '../../../components/dialog';
import { ReactiveFormsModule } from '@angular/forms';
import { VisualMemberRoutingModule, visualMemberRoutingComponents } from './visual-routing.module';
import { ZreFormModule } from '../../../components/form';
import { ZreEditorModule } from '../../../components/editor';
import { VisualService } from './visual.service';

@NgModule({
    imports: [
        CommonModule,
        ThemeModule,
        DialogModule,
        ReactiveFormsModule,
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

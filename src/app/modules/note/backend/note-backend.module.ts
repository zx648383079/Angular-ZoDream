import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { noteRoutingComponents, NoteRoutingModule } from './backend-routing.module';
import { NoteService } from './note.service';
import { ThemeModule } from '../../../theme/theme.module';
import { ZreFormModule } from '../../../components/form';
import { ZreEditorModule } from '../../../components/editor';
import { DialogModule } from '../../../components/dialog';

@NgModule({
    imports: [
        CommonModule,
        ThemeModule,
        ZreFormModule,
        DialogModule,
        NoteRoutingModule,
        ZreEditorModule,
    ],
    declarations: [...noteRoutingComponents],
    providers: [
        NoteService
    ]
})
export class NoteBackendModule { }

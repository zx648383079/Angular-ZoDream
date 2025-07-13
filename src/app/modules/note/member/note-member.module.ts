import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NoteMemberRoutingComponents, NoteMemberRoutingModule } from './routing.module';
import { NoteService } from './note.service';
import { DialogModule } from '../../../components/dialog';
import { ThemeModule } from '../../../theme/theme.module';
import { ZreEditorModule } from '../../../components/editor';
import { DesktopModule } from '../../../components/desktop';

@NgModule({
    imports: [
        CommonModule,
        ThemeModule,
        DesktopModule,
        DialogModule,
        ZreEditorModule,
        NoteMemberRoutingModule
    ],
    declarations: [...NoteMemberRoutingComponents],
    providers: [
        NoteService
    ]
})
export class NoteMemberModule { }

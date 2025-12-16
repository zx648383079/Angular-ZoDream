import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeModule } from '../../theme/theme.module';
import { noteRoutingComponents, NoteRoutingModule } from './note-routing.module';
import { NoteService } from './note.service';
import { ZreFormModule } from '../../components/form';
import { DesktopModule } from '../../components/desktop';
import { TabletModule } from '../../components/tablet';
import { Field } from '@angular/forms/signals';

@NgModule({
    imports: [
        CommonModule,
        ThemeModule,
        Field,
        DesktopModule,
        TabletModule,
        ZreFormModule,
        NoteRoutingModule,
    ],
    declarations: [...noteRoutingComponents],
    providers: [
        NoteService
    ]
})
export class NoteModule { }

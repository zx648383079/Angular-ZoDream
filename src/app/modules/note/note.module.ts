import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeModule } from '../../theme/theme.module';
import { noteRoutingComponents, NoteRoutingModule } from './note-routing.module';
import { NoteService } from './note.service';
import { ZreFormModule } from '../../components/form';

@NgModule({
    imports: [
        CommonModule,
        ThemeModule,
        ZreFormModule,
        NoteRoutingModule,
    ],
    declarations: [...noteRoutingComponents],
    providers: [
        NoteService
    ]
})
export class NoteModule { }

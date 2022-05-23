import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { noteRoutingComponents, NoteRoutingModule } from './backend-routing.module';
import { NoteService } from './note.service';
import { ThemeModule } from '../../../theme/theme.module';

@NgModule({
    imports: [
        CommonModule,
        ThemeModule,
        NoteRoutingModule,
    ],
    declarations: [...noteRoutingComponents],
    providers: [
        NoteService
    ]
})
export class NoteBackendModule { }

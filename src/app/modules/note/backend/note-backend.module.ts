import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { noteRoutingComponents, NoteRoutingModule } from './backend-routing.module';
import { NoteService } from './note.service';
import { ThemeModule } from '../../../theme/theme.module';
import { ZreFormModule } from '../../../components/form';

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
export class NoteBackendModule { }

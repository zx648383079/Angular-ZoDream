import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeModule } from '../../../theme/theme.module';
import { ReactiveFormsModule } from '@angular/forms';
import { bookBackendRoutingComponents, BookBackendRoutingModule } from './backend-routing.module';
import { BookService } from './book.service';
import { DialogModule } from '../../../components/dialog';
import { ZreFormModule } from '../../../components/form';
import { ZreEditorModule } from '../../../components/editor';
import { DesktopModule } from '../../../components/desktop';

@NgModule({
    imports: [
        CommonModule,
        ThemeModule,
        DesktopModule,
        BookBackendRoutingModule,
        ReactiveFormsModule,
        DialogModule,
        ZreFormModule,
        ZreEditorModule,
    ],
    declarations: [...bookBackendRoutingComponents],
    providers: [
        BookService,
    ]
})
export class BackendModule { }

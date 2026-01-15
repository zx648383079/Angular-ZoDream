import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeModule } from '../../../theme/theme.module';
import { bookBackendRoutingComponents, BookBackendRoutingModule } from './backend-routing.module';
import { BookService } from './book.service';
import { DialogModule } from '../../../components/dialog';
import { ZreFormModule } from '../../../components/form';
import { ZreEditorModule } from '../../../components/editor';
import { DesktopModule } from '../../../components/desktop';
import { FormField } from '@angular/forms/signals';

@NgModule({
    imports: [
        CommonModule,
        ThemeModule,
        FormField,
        DesktopModule,
        BookBackendRoutingModule,
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

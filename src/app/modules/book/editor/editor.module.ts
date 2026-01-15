import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeModule } from '../../../theme/theme.module';
import { DialogModule } from '../../../components/dialog';
import { ZreFormModule } from '../../../components/form';
import { BookEditorRoutingModule, bookEditorRoutingComponents } from './routing.module';
import { ContextMenuModule } from '../../../components/context-menu';
import { ZreMindModule } from '../../../components/mind';
import { BookService } from './book.service';
import { DesktopModule } from '../../../components/desktop';
import { FormField } from '@angular/forms/signals';

@NgModule({
    imports: [
        CommonModule,
        ThemeModule,
        FormField,
        DialogModule,
        DesktopModule,
        ContextMenuModule,
        BookEditorRoutingModule,
        ZreMindModule,
        ZreFormModule,
    ],
    declarations: [...bookEditorRoutingComponents],
    providers: [
        BookService
    ]
})
export class BookEditorModule { }

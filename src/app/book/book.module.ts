import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookRoutingModule, bookRoutingComponents } from './book-routing.module';
import { ThemeModule } from '../theme/theme.module';
import { BookService } from './book.service';
import { ChapterCatalogComponent } from './chapter/catalog/chapter-catalog.component';
import { FlipPagerComponent } from './reader/flip-pager/flip-pager.component';
import { ContextMenuModule } from '../context-menu';
import { ProgressModule } from '../progress';
import { ZreFormModule } from '../form';
import { ZreMindModule } from '../mind';
import { DialogModule } from '../dialog';
import { ZreEditorModule } from '../editor/editor.module';


@NgModule({
    declarations: [
        ...bookRoutingComponents,
        ChapterCatalogComponent,
        FlipPagerComponent,
    ],
    imports: [
        CommonModule,
        ThemeModule,
        BookRoutingModule,
        ContextMenuModule,
        ProgressModule,
        ZreFormModule,
        ZreMindModule,
        DialogModule,
        ZreEditorModule,
    ],
    providers: [
        BookService
    ]
})
export class BookModule { }

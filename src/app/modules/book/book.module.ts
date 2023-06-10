import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookRoutingModule, bookRoutingComponents } from './book-routing.module';
import { ThemeModule } from '../../theme/theme.module';
import { BookService } from './book.service';
import { ChapterCatalogComponent } from './chapter/catalog/chapter-catalog.component';
import { FlipPagerComponent } from './reader/flip-pager/flip-pager.component';
import { ContextMenuModule } from '../../components/context-menu';
import { ProgressModule } from '../../components/progress';
import { ZreFormModule } from '../../components/form';
import { ZreMindModule } from '../../components/mind';
import { DialogModule } from '../../components/dialog';
import { ZreEditorModule } from '../../components/editor';


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

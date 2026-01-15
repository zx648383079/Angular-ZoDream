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
import { DialogModule } from '../../components/dialog';
import { ZreEditorModule } from '../../components/editor';
import { DesktopModule } from '../../components/desktop';
import { TabletModule } from '../../components/tablet';
import { FormField } from '@angular/forms/signals';


@NgModule({
    declarations: [
        ...bookRoutingComponents,
        ChapterCatalogComponent,
        FlipPagerComponent,
    ],
    imports: [
        CommonModule,
        FormField,
        ThemeModule,
        DesktopModule,
        TabletModule,
        ContextMenuModule,
        BookRoutingModule,
        ProgressModule,
        ZreFormModule,
        DialogModule,
        ZreEditorModule,
    ],
    providers: [
        BookService
    ]
})
export class BookModule { }

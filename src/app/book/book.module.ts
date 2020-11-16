import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookRoutingModule, bookRoutingComponents } from './book-routing.module';
import { ThemeModule } from '../theme/theme.module';
import { BookService } from './book.service';
import { ChapterCatalogComponent } from './chapter/catalog/chapter-catalog.component';
import { FlipPagerComponent } from './reader/flip-pager/flip-pager.component';


@NgModule({
  declarations: [
    ...bookRoutingComponents,
    ChapterCatalogComponent,
    FlipPagerComponent,
  ],
  imports: [
    CommonModule,
    ThemeModule,
    BookRoutingModule
  ],
  providers: [
    BookService
  ]
})
export class BookModule { }

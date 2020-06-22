import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookRoutingModule, bookRoutingComponents } from './book-routing.module';
import { ThemeModule } from '../theme/theme.module';
import { BookService } from './book.service';


@NgModule({
  declarations: [
    ...bookRoutingComponents
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

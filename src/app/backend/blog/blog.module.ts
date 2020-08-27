import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditorModule } from '@tinymce/tinymce-angular';
import { BlogRoutingModule, blogRoutedComponents } from './blog-routing.module';
import { ThemeModule } from '../../theme/theme.module';
import { BlogService } from './blog.service';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';


@NgModule({
  declarations: [...blogRoutedComponents],
  imports: [
    CommonModule,
    ThemeModule,
    BlogRoutingModule,
    NgbPaginationModule,
    EditorModule,
  ],
  providers: [
    BlogService,
  ]
})
export class BlogModule { }

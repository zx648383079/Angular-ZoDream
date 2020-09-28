import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditorModule } from '@tinymce/tinymce-angular';
import { BlogRoutingModule, blogRoutedComponents } from './blog-routing.module';
import { ThemeModule } from '../../theme/theme.module';
import { BlogService } from './blog.service';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';


@NgModule({
  declarations: [...blogRoutedComponents],
  imports: [
    CommonModule,
    ThemeModule,
    BlogRoutingModule,
    NgbPaginationModule,
    ReactiveFormsModule,
    NgSelectModule,
    EditorModule,
  ],
  providers: [
    BlogService,
  ]
})
export class BlogModule { }

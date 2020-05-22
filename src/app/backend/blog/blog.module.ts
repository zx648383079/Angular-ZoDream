import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BlogRoutingModule } from './blog-routing.module';
import { BlogComponent } from './blog.component';
import { EditTagComponent } from './edit-tag/edit-tag.component';
import { TagComponent } from './tag/tag.component';
import { CategoryComponent } from './category/category.component';
import { EditCategoryComponent } from './edit-category/edit-category.component';
import { CommentComponent } from './comment/comment.component';
import { EditComponent } from './edit/edit.component';
import { ListComponent } from './list/list.component';
import { ThemeModule } from '../../theme/theme.module';


@NgModule({
  declarations: [
    BlogComponent,
    EditTagComponent,
    TagComponent,
    CategoryComponent, EditCategoryComponent, CommentComponent, EditComponent, ListComponent],
  imports: [
    CommonModule,
    ThemeModule,
    BlogRoutingModule
  ]
})
export class BlogModule { }

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BlogComponent } from './blog.component';
import { ListComponent } from './list/list.component';
import { EditComponent } from './edit/edit.component';
import { CategoryComponent } from './category/category.component';
import { EditCategoryComponent } from './edit-category/edit-category.component';
import { TagComponent } from './tag/tag.component';
import { EditTagComponent } from './edit-tag/edit-tag.component';
import { CommentComponent } from './comment/comment.component';

const routes: Routes = [
  { path: '', component: BlogComponent },
  {
    path: 'list',
    component: ListComponent
  },
  {
    path: 'create',
    component: EditComponent
  },
  {
    path: 'category',
    component: CategoryComponent
  },
  {
    path: 'category/create',
    component: EditCategoryComponent
  },
  {
    path: 'tag',
    component: TagComponent
  },
  {
    path: 'tag/create',
    component: EditTagComponent
  },
  {
    path: 'comment',
    component: CommentComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BlogRoutingModule { }

export const blogRoutedComponents = [
  BlogComponent,
  EditTagComponent,
  TagComponent,
  CategoryComponent, EditCategoryComponent, CommentComponent, EditComponent, ListComponent
];

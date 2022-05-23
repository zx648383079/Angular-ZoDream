import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BlogComponent } from './blog.component';
import { ListComponent } from './list/list.component';
import { EditComponent } from './edit/edit.component';
import { CategoryComponent } from './category/category.component';
import { EditCategoryComponent } from './category/edit/edit-category.component';
import { TagComponent } from './tag/tag.component';
import { EditTagComponent } from './tag/edit/edit-tag.component';
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
    path: 'edit/:id',
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
    path: 'category/edit/:id',
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
    path: 'tag/edit/:id',
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
export class BlogBackendRoutingModule { }

export const blogBackendRoutedComponents = [
  BlogComponent,
  EditTagComponent,
  TagComponent,
  CategoryComponent, EditCategoryComponent, CommentComponent, EditComponent, ListComponent
];

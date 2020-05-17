import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BlogComponent } from './blog.component';
import { ListComponent } from './list/list.component';
import { DetailComponent } from './detail/detail.component';
import { ArchivesComponent } from './archives/archives.component';
import { TagComponent } from './tag/tag.component';
import { CategoryComponent } from './category/category.component';

const routes: Routes = [
  {
    path: '',
    component: BlogComponent,
    children: [
      {
        path: 'list',
        component: ListComponent
      },
      {
        path: 'archives',
        component: ArchivesComponent
      },
      {
        path: 'tag',
        component: TagComponent
      },
      {
        path: 'category',
        component: CategoryComponent
      },
      {
        path: 'detail/:id',
        component: DetailComponent
      },
      {
        path: ':id',
        component: DetailComponent
      },
      {
          path: '',
          component: ListComponent
      },
      {
          path: '**',
          component: ListComponent,
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BlogRoutingModule { }

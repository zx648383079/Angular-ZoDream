import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ForumComponent } from './forum.component';
import { HomeComponent } from './home/home.component';
import { ListComponent } from './list/list.component';
import { ThreadComponent } from './thread/thread.component';

const routes: Routes = [
  {
    path: '',
    component: ForumComponent,
    children: [
      {
        path: 'thread/:id',
        component: ThreadComponent
      },
      {
        path: ':id',
        component: ListComponent
      },
      {
        path: '',
        component: HomeComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ForumRoutingModule { }

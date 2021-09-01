import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EditComponent } from './edit/edit.component';

import { ForumComponent } from './forum.component';
import { ForumListComponent } from './list/forum-list.component';
import { ThreadComponent } from './thread/thread.component';

const routes: Routes = [
    {
        path: 'thread',
        component: ThreadComponent,
    },
    {
        path: 'create',
        component: EditComponent,
    },
    {
        path: 'edit/:id',
        component: EditComponent,
    },
    {
        path: 'list',
        component: ForumListComponent,
    },
    {
        path: '',
        component: ForumComponent,
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ForumRoutingModule { }

export const forumRoutedComponents = [
  ForumComponent, ThreadComponent, EditComponent, ForumListComponent,
];

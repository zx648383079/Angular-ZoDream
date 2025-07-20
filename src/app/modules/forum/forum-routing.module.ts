import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ForumEditorComponent, PostBlockComponent, SearchBarComponent, ThreadListItemComponent } from './components';

import { ForumComponent } from './forum.component';
import { HomeComponent } from './home/home.component';
import { ListComponent } from './list/list.component';
import { EditThreadComponent } from './thread/edit/edit-thread.component';
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
                path: ':forum/create',
                component: EditThreadComponent,
            },
            {
                path: ':forum/edit/:id',
                component: EditThreadComponent,
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

export const forumRoutedComponents = [
    ForumComponent, ThreadComponent, ListComponent, HomeComponent, ForumEditorComponent, EditThreadComponent, PostBlockComponent, SearchBarComponent,
    ThreadListItemComponent
];

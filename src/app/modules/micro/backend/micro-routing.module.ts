import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommentComponent } from './comment/comment.component';
import { MicroComponent } from './micro.component';
import { PostComponent } from './post/post.component';
import { TopicComponent } from './topic/topic.component';

const routes: Routes = [
    {
        path: 'comment',
        component: CommentComponent,
    },
    {
        path: 'post',
        component: PostComponent,
    },
    {
        path: 'topic',
        component: TopicComponent,
    },
    {
        path: '',
        component: MicroComponent,
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MicroBackendRoutingModule { }

export const microBackendRoutedComponents = [
    MicroComponent, CommentComponent, PostComponent, TopicComponent
];

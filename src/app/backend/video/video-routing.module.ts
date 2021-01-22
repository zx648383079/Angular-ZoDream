import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommentComponent } from './comment/comment.component';
import { ListComponent } from './list/list.component';
import { EditMusicComponent } from './music/edit/edit-music.component';
import { MusicComponent } from './music/music.component';
import { VideoComponent } from './video.component';

const routes: Routes = [
    {
        path: 'comment',
        component: CommentComponent,
    },
    {
        path: 'music/create',
        component: EditMusicComponent,
    },
    {
        path: 'music/edit/:id',
        component: EditMusicComponent,
    },
    {
        path: 'music',
        component: MusicComponent,
    },
    {
        path: 'list',
        component: ListComponent,
    },
    {
        path: '',
        component: VideoComponent,
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VideoRoutingModule { }

export const videoRoutedComponents = [
    VideoComponent, ListComponent, MusicComponent, CommentComponent, EditMusicComponent
];

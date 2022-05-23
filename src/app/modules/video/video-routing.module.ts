

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { VideoComponent } from '../video/video.component';
import { VideoDetailComponent } from './detail/video-detail.component';

const routes: Routes = [
    { path: 'video/:id', component: VideoDetailComponent },
    { path: '', component: VideoComponent },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class VideoRoutingModule { }

export const videoRoutingComponents = [
    VideoComponent, VideoDetailComponent
];

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AudioPlayerComponent } from './audio-player/audio-player.component';
import { VideoPlayerComponent } from './video-player/video-player.component';
import { ThemeModule } from '../theme/theme.module';
import { ProgressModule } from '../progress';

@NgModule({
    imports: [
        CommonModule,
        ThemeModule,
        ProgressModule,
    ],
    declarations: [
        AudioPlayerComponent,
        VideoPlayerComponent
    ],
    exports: [
        AudioPlayerComponent,
        VideoPlayerComponent
    ]
})
export class MediaPlayerModule { }

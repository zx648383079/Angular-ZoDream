import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AudioPlayerComponent } from './audio-player/audio-player.component';
import { VideoPlayerComponent } from './video-player/video-player.component';
import { ThemeModule } from '../theme/theme.module';
import { ProgressModule } from '../progress';
import { MusicPlayerComponent } from './fixed/music-player/music-player.component';
import { MoviePlayerComponent } from './fixed/movie-player/movie-player.component';
import { LyricsViewerComponent } from './fixed/music-player/lyrics-viewer/lyrics-viewer.component';
import { SpectrumPanelComponent } from './fixed/music-player/spectrum-panel/spectrum-panel.component';

const COMPONENTS = [
    AudioPlayerComponent,
    VideoPlayerComponent,
    MusicPlayerComponent,
    MoviePlayerComponent,
];

@NgModule({
    imports: [
        CommonModule,
        ThemeModule,
        ProgressModule,
    ],
    declarations: [
        ... COMPONENTS,
        LyricsViewerComponent,
        SpectrumPanelComponent,
    ],
    exports: [
        ... COMPONENTS
    ]
})
export class MediaPlayerModule { }

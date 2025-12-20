import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AudioPlayerComponent } from './audio-player/audio-player.component';
import { VideoPlayerComponent } from './video-player/video-player.component';
import { MusicPlayerComponent } from './fixed/music-player/music-player.component';
import { MoviePlayerComponent } from './fixed/movie-player/movie-player.component';
import { LyricsViewerComponent } from './fixed/music-player/lyrics-viewer/lyrics-viewer.component';
import { SpectrumPanelComponent } from './fixed/music-player/spectrum-panel/spectrum-panel.component';
import { PlayListComponent } from './fixed/music-player/play-list/play-list.component';
import { DurationPipe } from './duration.pipe';
import { PlayerService } from './fixed/player.service';
import { ImagePlayerComponent } from './fixed/image-player/image-player.component';
import { ProgressBarComponent } from './progress-bar/progress-bar.component';
import { ZreFormModule } from '../form';

const COMPONENTS = [
    AudioPlayerComponent,
    VideoPlayerComponent,
    MusicPlayerComponent,
    MoviePlayerComponent,
    ImagePlayerComponent,
    ProgressBarComponent,
];

@NgModule({
    imports: [
        CommonModule,
        ZreFormModule,
    ],
    declarations: [	
        ... COMPONENTS,
        LyricsViewerComponent,
        SpectrumPanelComponent,
        PlayListComponent,
        DurationPipe,
    ],
    providers: [
        PlayerService
    ],
    exports: [
        ... COMPONENTS,
    ]
})
export class MediaPlayerModule { }

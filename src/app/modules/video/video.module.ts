import {
    NgModule
} from '@angular/core';
import {
    CommonModule
} from '@angular/common';
import {
    videoRoutingComponents,
    VideoRoutingModule
} from './video-routing.module';
import { FormsModule } from '@angular/forms';
import { ThemeModule } from '../../theme/theme.module';
import { VideoService } from './video.service';
import { ZreFormModule } from '../../components/form';
import { MediaPlayerModule } from '../../components/media-player';
import { DesktopModule } from '../../components/desktop';
import { TabletModule } from '../../components/tablet';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ThemeModule,
        DesktopModule,
        TabletModule,
        MediaPlayerModule,
        VideoRoutingModule,
        ZreFormModule,
    ],
    declarations: [...videoRoutingComponents],
    providers: [
        VideoService,
    ]
})
export class VideoModule {}
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
import { ThemeModule } from '../../theme/theme.module';
import { VideoService } from './video.service';
import { ZreFormModule } from '../../components/form';
import { MediaPlayerModule } from '../../components/media-player';
import { DesktopModule } from '../../components/desktop';
import { TabletModule } from '../../components/tablet';
import { FormField } from '@angular/forms/signals';

@NgModule({
    imports: [
        CommonModule,
        FormField,
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
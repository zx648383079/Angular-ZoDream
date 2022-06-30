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

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ThemeModule,
        VideoRoutingModule,
        ZreFormModule,
    ],
    declarations: [...videoRoutingComponents],
    providers: [
        VideoService,
    ]
})
export class VideoModule {}
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeModule } from '../../../theme/theme.module';
import { ReactiveFormsModule } from '@angular/forms';
import { videoRoutedComponents, VideoRoutingModule } from './video-routing.module';
import { VideoService } from './video.service';
import { DurationPipe } from './duration.pipe';

@NgModule({
    imports: [
        CommonModule,
        ThemeModule,
        ReactiveFormsModule,
        VideoRoutingModule,
    ],
    declarations: [...videoRoutedComponents, DurationPipe],
    providers: [
        VideoService
    ]
})
export class VideoModule { }

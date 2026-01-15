import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeModule } from '../../../theme/theme.module';
import { videoRoutedComponents, VideoRoutingModule } from './video-routing.module';
import { VideoService } from './video.service';
import { DurationPipe } from './duration.pipe';
import { DesktopModule } from '../../../components/desktop';
import { FormField } from '@angular/forms/signals';
import { ZreFormModule } from '../../../components/form';

@NgModule({
    imports: [
        CommonModule,
        FormField,
        ThemeModule,
        ZreFormModule,
        DesktopModule,
        VideoRoutingModule,
    ],
    declarations: [...videoRoutedComponents, DurationPipe],
    providers: [
        VideoService
    ]
})
export class VideoModule { }

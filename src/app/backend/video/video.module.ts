import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VideoComponent } from './video.component';
import { ThemeModule } from '../../theme/theme.module';
import { NgbModalModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { ReactiveFormsModule } from '@angular/forms';
import { videoRoutedComponents, VideoRoutingModule } from './video-routing.module';
import { VideoService } from './video.service';
import { DurationPipe } from './duration.pipe';

@NgModule({
  imports: [
    CommonModule,
    ThemeModule,
    NgbPaginationModule,
    NgbModalModule,
    ReactiveFormsModule,
    VideoRoutingModule,
  ],
  declarations: [...videoRoutedComponents, DurationPipe],
  providers: [
    VideoService
  ]
})
export class VideoModule { }

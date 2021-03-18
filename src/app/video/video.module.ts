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
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        VideoRoutingModule
    ],
    declarations: [...videoRoutingComponents]
})
export class VideoModule {}
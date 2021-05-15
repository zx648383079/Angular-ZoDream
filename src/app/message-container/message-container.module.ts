import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MessageContainerComponent } from './message-container.component';
import { ThemeModule } from '../theme/theme.module';
import { MediaPlayerModule } from '../media-player/media-player.module';
import { VoicePlayerComponent } from './voice-player/voice-player.component';

@NgModule({
    imports: [
        CommonModule,
        ThemeModule,
        MediaPlayerModule,
    ],
    declarations: [MessageContainerComponent, VoicePlayerComponent],
    exports: [
        MessageContainerComponent,
    ]
})
export class MessageContainerModule { }

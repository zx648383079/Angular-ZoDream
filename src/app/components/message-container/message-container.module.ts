import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MessageContainerComponent } from './message-container.component';
import { MediaPlayerModule } from '../media-player/media-player.module';
import { VoicePlayerComponent } from './voice-player/voice-player.component';
import { ProgressModule } from '../progress';
import { LinkRuleModule } from '../link-rule';

@NgModule({
    imports: [
        CommonModule,
        ProgressModule,
        MediaPlayerModule,
        LinkRuleModule,
    ],
    declarations: [MessageContainerComponent, VoicePlayerComponent],
    exports: [
        MessageContainerComponent,
    ]
})
export class MessageContainerModule { }

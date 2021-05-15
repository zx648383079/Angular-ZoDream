import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ChatRoutingModule } from './chat-routing.module';
import { ChatComponent } from './chat.component';
import { ChatService } from './chat.service';
import { ThemeModule } from '../theme/theme.module';
import { MessageContainerModule } from '../message-container/message-container.module';
import { ContextMenuModule } from '../context-menu/context-menu.module';
import { DialogModule } from '../dialog';


@NgModule({
    declarations: [
        ChatComponent,
    ],
    imports: [
        CommonModule,
        ThemeModule,
        ChatRoutingModule,
        MessageContainerModule,
        ContextMenuModule,
        DialogModule,
    ],
    providers: [
        ChatService
    ]
})
export class ChatModule { }

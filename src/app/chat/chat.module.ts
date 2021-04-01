import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ChatRoutingModule } from './chat-routing.module';
import { ChatComponent } from './chat.component';
import { ChatService } from './chat.service';
import { ThemeModule } from '../theme/theme.module';
import { ContextMenuComponent } from './context-menu/context-menu.component';
import { MessageContainerComponent } from './message-container/message-container.component';


@NgModule({
    declarations: [
        ChatComponent,
        ContextMenuComponent,
        MessageContainerComponent,
    ],
    imports: [
        CommonModule,
        ThemeModule,
        ChatRoutingModule
    ],
    providers: [
        ChatService
    ]
})
export class ChatModule { }

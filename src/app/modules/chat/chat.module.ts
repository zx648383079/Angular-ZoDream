import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ChatRoutingModule, contactRoutedComponents } from './chat-routing.module';
import { ChatService } from './chat.service';
import { ThemeModule } from '../../theme/theme.module';
import { MessageContainerModule } from '../../components/message-container';
import { ContextMenuModule } from '../../components/context-menu';
import { DialogModule } from '../../components/dialog';
import { DesktopModule } from '../../components/desktop';


@NgModule({
    declarations: [
       ...contactRoutedComponents
    ],
    imports: [
        CommonModule,
        ThemeModule,
        DesktopModule,
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

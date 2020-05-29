import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ChatRoutingModule } from './chat-routing.module';
import { ChatComponent } from './chat.component';
import { ChatService } from './chat.service';
import { ThemeModule } from '../theme/theme.module';


@NgModule({
  declarations: [ChatComponent],
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

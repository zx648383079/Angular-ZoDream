import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ChatRoutingModule } from './chat-routing.module';
import { ChatComponent } from './chat.component';
import { ChatService } from './chat.service';
import { ThemeModule } from '../theme/theme.module';
import { SearchComponent } from './search/search.component';
import { ContextMenuComponent } from './context-menu/context-menu.component';
import { EditClassifyComponent } from './edit-classify/edit-classify.component';
import { ProfileComponent } from './profile/profile.component';


@NgModule({
    declarations: [
        ChatComponent, SearchComponent, ContextMenuComponent,
        EditClassifyComponent, ProfileComponent
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

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { forumRoutedComponents, ForumRoutingModule } from './forum-routing.module';
import { ForumService } from './forum.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ThemeModule } from '../theme/theme.module';
import { MediaPlayerModule } from '../media-player/media-player.module';
import { DialogModule } from '../dialog';
import { ZreFormModule } from '../form';

@NgModule({
    declarations: [...forumRoutedComponents],
    imports: [
        CommonModule,
        FormsModule,
        ThemeModule,
        ReactiveFormsModule,
        ForumRoutingModule,
        MediaPlayerModule,
        DialogModule,
        ZreFormModule,
    ],
    providers: [
        ForumService
    ],
})
export class ForumModule { }

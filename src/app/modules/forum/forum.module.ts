import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { forumRoutedComponents, ForumRoutingModule } from './forum-routing.module';
import { ForumService } from './forum.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ThemeModule } from '../../theme/theme.module';
import { MediaPlayerModule } from '../../components/media-player';
import { DialogModule } from '../../components/dialog';
import { ZreFormModule } from '../../components/form';
import { DesktopModule } from '../../components/desktop';

@NgModule({
    declarations: [...forumRoutedComponents],
    imports: [
        CommonModule,
        FormsModule,
        ThemeModule,
        DesktopModule,
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

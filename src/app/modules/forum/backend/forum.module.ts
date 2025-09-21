import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeModule } from '../../../theme/theme.module';
import { forumRoutedComponents, ForumRoutingModule } from './forum-routing.module';
import { ForumService } from './forum.service'; 
import { ReactiveFormsModule } from '@angular/forms';
import { DialogModule } from '../../../components/dialog';
import { ZreFormModule } from '../../../components/form';
import { DesktopModule } from '../../../components/desktop';
import { ZreSwiperModule } from '../../../components/swiper';
import { ForumCommonModule } from '../forum-common.module';

@NgModule({
    imports: [
        CommonModule,
        ThemeModule,
        DesktopModule,
        ReactiveFormsModule,
        ForumRoutingModule,
        DialogModule,
        ZreSwiperModule,
        ForumCommonModule,
        ZreFormModule,
    ],
    declarations: [...forumRoutedComponents],
    providers: [
        ForumService
    ]
})
export class ForumModule { }

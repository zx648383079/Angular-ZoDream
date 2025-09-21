import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { forumRoutedComponents, ForumRoutingModule } from './forum-routing.module';
import { ForumService } from './forum.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ThemeModule } from '../../theme/theme.module';
import { DialogModule } from '../../components/dialog';
import { ZreFormModule } from '../../components/form';
import { DesktopModule } from '../../components/desktop';
import { ForumCommonModule } from './forum-common.module';

@NgModule({
    declarations: [...forumRoutedComponents],
    imports: [
        CommonModule,
        FormsModule,
        ThemeModule,
        DesktopModule,
        ReactiveFormsModule,
        ForumRoutingModule,
        DialogModule,
        ForumCommonModule,
        ZreFormModule,
    ],
    providers: [
        ForumService
    ],
})
export class ForumModule { }

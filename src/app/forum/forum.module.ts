import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { forumRoutedComponents, ForumRoutingModule } from './forum-routing.module';
import { ForumService } from './forum.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ThemeModule } from '../theme/theme.module';

@NgModule({
    declarations: [...forumRoutedComponents],
    imports: [
        CommonModule,
        FormsModule,
        ThemeModule,
        ReactiveFormsModule,
        ForumRoutingModule,
    ],
    providers: [
        ForumService
    ],
})
export class ForumModule { }
